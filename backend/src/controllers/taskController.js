const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

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

//3. lưu vị trí kéo thả 
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, cardId } = req.body; 
    const taskRef = db.collection('tasks').doc(taskId);
    const doc = await taskRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Tạo object chứa dữ liệu cần update
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (cardId) updates.cardId = cardId; 

    await taskRef.update(updates);

    // Trả về task đã update
    const updatedDoc = await taskRef.get();
    res.status(200).json(updatedDoc.data());

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//4. update task 
exports.updateTask = async (req, res) => {
  try{
    const {taskId} = req.params;
    const {title, description, cardId} = req.body;

    const taskRef = db.collection('tasks').doc(taskId);
    const doc = await taskRef.get();

    if(!doc.exists){
      return res.status(404).json({ error: 'Task not found' });
    }

    const update ={};
    if(title) update.title = title;
    if(description !== undefined) update.description = description;
    if(cardId) update.cardId = cardId;

    await taskRef.update(update);
    const updatedDoc = await taskRef.get();
    res.status(200).json(updatedDoc.data());
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

    await taskRef.delete();
    res.status(204).send()
  }catch(error){
    res.status(500).json({ error: error.message });
  }

};
