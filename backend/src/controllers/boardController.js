const {db} = require('../config/firebase');
const {v4: uuidv4} = require('uuid');

//hàm tạo bảng mới
const createBoard = async (req, res) => {
    try{
        const { name } = req.body;
        const userId = req.user.uid; 

        if(!name ) return res.status(400).json({ error: 'Board name is required.' });

        const newBoard = {
            id: uuidv4(),
            name,
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

//hàm lấy danh sách bảng
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


module.exports = { createBoard, getBoards };