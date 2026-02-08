const express = require('express');
const router = express.Router({ mergeParams: true }); 
const cardController = require('../controllers/cardController');
const taskController = require('../controllers/taskController');
const verifyToken = require('../middlewares/authMiddleware');

router.use(verifyToken);

//api card 
router.post('/', cardController.createCard);
router.get('/', cardController.getCardsByBoard);

//api task
router.post('/:cardId/tasks', taskController.createTask);
router.get('/:cardId/tasks', taskController.getTasksByCard);
router.put('/:cardId/tasks/:taskId', taskController.updateTask);

module.exports = router;
