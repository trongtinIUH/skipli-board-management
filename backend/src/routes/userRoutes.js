const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');

router.use(verifyToken);

//lấy tất cả users
router.get('/', userController.getAllUsers);

//lấy thông tin user theo id
router.get('/:id', userController.getUserById);

//update thông tin user
router.put('/:id', userController.updateUser);

//lấy members của board
router.get('/boards/:boardId/members', userController.getBoardMembers);

module.exports = router;
