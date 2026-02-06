const express = require('express');
const router = express.Router();
const authenController = require('../controllers/boardController');
const verifyToken = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.post('/', authenController.createBoard);
router.get('/', authenController.getBoards);

module.exports = router;