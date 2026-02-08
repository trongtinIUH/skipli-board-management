const {db} = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const { emitToBoard } = require('../utils/socketHelper');


//1. tạo cột mới trong chi tiết bảng
exports.createCard  = async (req, res) => {
    try{
    const { boardId } = req.params;
    const { name } = req.body;

    if(!name) return res.status(400).json({ error: 'Card name is required' });

    const newCard ={
        id: uuidv4(),
        name: name,
        boardId: boardId,
        createdAt: new Date().toISOString(),
        items: []
    };

    await db.collection('cards').doc(newCard.id).set(newCard);

    // emit socket event cho các user khác biết có cột mới
    emitToBoard(req, boardId, 'card-created', newCard);

    res.status(201).json(newCard);
    }catch(error){
    res.status(500).json({ error: error.message });
    }
};

//2. lấy danh sách cột trong 1 bảng 
exports.getCardsByBoard = async (req, res) => {
    try{
    const { boardId } = req.params;

    //lấy all card trong board 
    const cardsSnapshot = await db.collection('cards')
        .where('boardId', '==', boardId)
        .get();

    const cards = [];
    cardsSnapshot.forEach(doc => {
        cards.push(doc.data());
    });

    //sắp xếp lại theo createdAt
    cards.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    res.status(200).json(cards);
    }catch(error){
    console.error('Error in getCardsByBoard:', error);
    res.status(500).json({ error: error.message });
    }
};

