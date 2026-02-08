const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');
const verifyToken = require('../middlewares/authMiddleware');

router.use(verifyToken);

//lấy thông tin github repo
router.get('/repositories/:repositoryId/github-info', githubController.getRepoInfo);

//attach github vào task
router.post('/boards/:boardId/cards/:cardId/tasks/:taskId/github-attach', githubController.attachGithubToTask);

//lấy attachments của task
router.get('/boards/:boardId/cards/:cardId/tasks/:taskId/github-attachments', githubController.getGithubAttachments);

//xóa attachment
router.delete('/boards/:boardId/cards/:cardId/tasks/:taskId/github-attachments/:attachmentId', githubController.removeGithubAttachment);

module.exports = router;
