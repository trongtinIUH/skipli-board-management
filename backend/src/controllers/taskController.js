const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const { emitToBoard } = require('../utils/socketHelper');

//1. tạo task mới 
exports.createTask = async (req, res) => {
    try{
    const { boardId, cardId } = req.params;
    const { title, description } = req.body;
    const userId = req.user.uid;

    if(!title) return res.status(400).json({ error: 'Task title is required' });

    const newTask ={
        id: uuidv4(),
        title: title,
        description: description || '',
        boardId: boardId,
        cardId: cardId,
        ownerId: userId,
        createdAt: new Date().toISOString(),
        members: [], 
        labels: []   
    };

    await db.collection('tasks').doc(newTask.id).set(newTask);

    // emit socket event cho các user khác trong board
    emitToBoard(req, boardId, 'task-created', newTask);

    res.status(201).json(newTask);
    }catch(error){
    res.status(500).json({ error: error.message });
    }
};

//2. lấy task của 1 cột 
exports.getTasksByCard = async (req, res) => {
    try{
    const {cardId} = req.params;

    const snapshot = await db.collection('tasks')
        .where('cardId', '==', cardId).get();

    const task = snapshot.docs.map(doc => doc.data());

    task.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    res.status(200).json(task);
    }catch(error){
    res.status(500).json({ error: error.message });
    }
};

//3. update task (kéo thả + sửa nội dung)
exports.updateTask = async (req, res) => {
  try{
    const {taskId} = req.params;
    const {title, description, cardId, githubLinks} = req.body;

    const taskRef = db.collection('tasks').doc(taskId);
    const doc = await taskRef.get();

    if(!doc.exists){
      return res.status(404).json({ error: 'Task not found' });
    }

    const update ={};
    if(title) update.title = title;
    if(description !== undefined) update.description = description;
    if(cardId) update.cardId = cardId;
    if(githubLinks !== undefined) update.githubLinks = githubLinks;

    await taskRef.update(update);
    const updatedDoc = await taskRef.get();

    // emit socket event - thông báo task đã được update
    const updatedData = updatedDoc.data();
    emitToBoard(req, updatedData.boardId, 'task-updated', updatedData);

    res.status(200).json(updatedData);
  }catch(error){
    res.status(500).json({ error: error.message });
  }
};

//5. xóa task
exports.deleteTask = async (req, res) => {
  try{
    const {taskId} = req.params;
    const taskRef = db.collection('tasks').doc(taskId);
    const doc = await taskRef.get();

    if(!doc.exists){
      return res.status(404).json({ error: 'Task not found' });
    }

    const taskData = doc.data();
    await taskRef.delete();

    // emit socket event - thông báo task đã bị xóa
    emitToBoard(req, taskData.boardId, 'task-deleted', { 
      taskId: taskId, 
      cardId: taskData.cardId 
    });

    res.status(204).send()
  }catch(error){
    res.status(500).json({ error: error.message });
  }

};

//6. assign member vào task
exports.assignMemberToTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { memberId } = req.body;

    const taskRef = db.collection('tasks').doc(taskId);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const currentMembers = taskDoc.data().members || [];
    
    //kiểm tra đã assign chưa
    if (currentMembers.includes(memberId)) {
      return res.status(400).json({ error: 'Member already assigned to this task' });
    }

    await taskRef.update({
      members: [...currentMembers, memberId]
    });

    res.status(201).json({ 
      taskId: taskId,
      memberId: memberId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//7. lấy danh sách members đã assign vào task
exports.getAssignedMembers = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const taskRef = db.collection('tasks').doc(taskId);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const memberIds = taskDoc.data().members || [];
    
    //lấy thông tin chi tiết từng member
    const members = [];
    for (const memberId of memberIds) {
      const userDoc = await db.collection('users').doc(memberId).get();
      if (userDoc.exists) {
        members.push({
          taskId: taskId,
          memberId: memberId,
          email: userDoc.data().email
        });
      }
    }

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//8. xóa member khỏi task
exports.removeMemberFromTask = async (req, res) => {
  try {
    const { taskId, memberId } = req.params;

    const taskRef = db.collection('tasks').doc(taskId);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const currentMembers = taskDoc.data().members || [];
    const updatedMembers = currentMembers.filter(id => id !== memberId);

    await taskRef.update({
      members: updatedMembers
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
