const {db} = require('../config/firebase');
const {v4: uuidv4} = require('uuid');

//1 hàm tạo bảng mới
const createBoard = async (req, res) => {
    try{
        const { name, description } = req.body;
        const userId = req.user.uid; 

        if(!name ) return res.status(400).json({ error: 'Board name is required.' });

        const newBoard = {
            id: uuidv4(),
            name: name,
            description: description || '',
            ownerId: userId,
            memberIds: [userId],
            createdAt: new Date().toISOString(),
            columns: []
        };
        await db.collection('boards').doc(newBoard.id).set(newBoard);
        res.status(201).json(newBoard);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create board.' });
    }
};

//2 hàm lấy danh sách bảng
const getBoards = async (req, res) => {
    try{
        const userId = req.user.uid;
        const snapshot = await db.collection('boards')
        .where('memberIds', 'array-contains', userId)
        .get();
        const boards = snapshot.docs.map(doc => doc.data());
        res.status(200).json(boards);
    }catch (error) {
        res.status(500).json({ error: 'Failed to fetch boards.' });
    }
};
//3 lấy chi tiết bảng
const getBoardById = async (req, res) => {
    try{
        const {id} = req.params;
        const userId = req.user.uid;
        const boardRef = db.collection('boards').doc(id);
        const doc = await  boardRef.get();
        
        if(!doc.exists){return res.status(404).json({error: 'Board not found' })}

        const boardData = doc.data();
        if(!boardData.memberIds.includes(userId)){
            return res.status(403).json({ error: 'Access denied to this board.' });
        }
        res.status(200).json(boardData);
    }catch (error) {
       res.status(500).json({ error: error.message });
    }
};

//4 cập nhật bảng 
const updateBoard = async (req, res) => {
    try{
        const {id} = req.params;
        const {name , description} = req.body;
        const userId = req.user.uid;

        const boardRef = db.collection('boards').doc(id);
        const doc = await boardRef.get();   

        if(!doc.exists){return res.status(404).json({ error: 'Board not found.' });}

        if(doc.data().ownerId !== userId){
            return res.status(403).json({ error: 'Unauthorized: Only owner can update.' });
        }

        await boardRef.update({ 
            name: name || doc.data().name, 
            description: description || doc.data().description });

        //get lại data mới
        const updatedDoc = await boardRef.get();
        const updatedBoard = updatedDoc.data();
        res.status(200).json(updatedBoard);
    }catch (error) {
         res.status(500).json({ error: error.message });
    }
};

//5 xóa bảng 
const deleteBoard = async (req, res) => {
    try{
        const {id} = req.params;
        const userId = req.user.uid;

        const boardRef = db.collection('boards').doc(id); 
        const doc = await boardRef.get();

        if(!doc.exists){return res.status(404).json({ error: 'Board not found.' });}

        if(doc.data().ownerId !== userId){
            return res.status(403).json({ error: 'Unauthorized: Only owner can delete.' });
        }

        await boardRef.delete();
        res.status(204).send();        
    }catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// mời thành viên vào 
const inviteUserToBoard = async (req, res) => {
    try {
        const boardId = req.params.id;  
        const { email } = req.body; 

        // 1. Kiểm tra board tồn tại trước
        const boardRef = db.collection('boards').doc(boardId);
        const boardDoc = await boardRef.get();
        
        if (!boardDoc.exists) {
            return res.status(404).json({ error: 'Board not found.' });
        }

        // 2. Tìm user bằng email
        const userSnapshot = await db.collection('users').where('email', '==', email).get();
        
        if (userSnapshot.empty) {
            return res.status(404).json({ error: 'User not found with this email.' });
        }
        
        const userDoc = userSnapshot.docs[0];
        const userToAdd = userDoc.data();
        const userUid = userDoc.id; 

        // 3. Kiểm tra user đã là member chưa
        const currentMembers = boardDoc.data().memberIds || [];
        
        if (currentMembers.includes(userUid)) {
            return res.status(400).json({ error: 'User is already a member of the board.' });
        }

        // 4. Thêm user vào board
        await boardRef.update({
            memberIds: [...currentMembers, userUid]
        });
        
        res.status(200).json({ 
            message: 'User added to board successfully', 
            user: {
                uid: userUid,
                email: userToAdd.email,
                displayName: userToAdd.displayName || userToAdd.email
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = { createBoard, getBoards, getBoardById, updateBoard, deleteBoard, inviteUserToBoard };