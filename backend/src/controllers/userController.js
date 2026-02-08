const { db } = require('../config/firebase');

//lấy danh sách tất cả users
exports.getAllUsers = async (req, res) => {
    try {
        const snapshot = await db.collection('users').get();
        
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                email: data.email,
                displayName: data.displayName || data.email.split('@')[0],
                createdAt: data.createdAt || null
            };
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//lấy thông tin user theo id
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const userRef = db.collection('users').doc(id);
        const doc = await userRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = doc.data();
        res.status(200).json({
            id: doc.id,
            email: userData.email,
            displayName: userData.displayName || userData.email.split('@')[0],
            createdAt: userData.createdAt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//cập nhật thông tin user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { displayName } = req.body;
        const currentUserId = req.user.uid;

        //chỉ cho phép user update chính mình
        if (id !== currentUserId) {
            return res.status(403).json({ error: 'You can only update your own profile' });
        }

        const userRef = db.collection('users').doc(id);
        const doc = await userRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updates = {};
        if (displayName) updates.displayName = displayName;
        updates.updatedAt = new Date().toISOString();

        await userRef.update(updates);

        const updatedDoc = await userRef.get();
        res.status(200).json(updatedDoc.data());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//lấy members của board
exports.getBoardMembers = async (req, res) => {
    try {
        const { boardId } = req.params;
        
        //lấy board để lấy memberIds
        const boardRef = db.collection('boards').doc(boardId);
        const boardDoc = await boardRef.get();

        if (!boardDoc.exists) {
            return res.status(404).json({ error: 'Board not found' });
        }

        const memberIds = boardDoc.data().memberIds || [];
        
        //lấy thông tin từng member
        const members = [];
        for (const memberId of memberIds) {
            const userDoc = await db.collection('users').doc(memberId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                members.push({
                    id: userDoc.id,
                    email: userData.email,
                    displayName: userData.displayName || userData.email.split('@')[0]
                });
            }
        }

        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
