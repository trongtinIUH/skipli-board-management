const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const verifyToken = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.post('/', boardController.createBoard);
router.get('/', boardController.getBoards);
router.get('/:id', boardController.getBoardById);
router.put('/:id', boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);

//thêm user vào board
router.post('/:id/invite', boardController.inviteUserToBoard);

module.exports = router;