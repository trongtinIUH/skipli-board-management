const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

//lấy thông tin repo github (mock data cho demo)
exports.getRepoInfo = async (req, res) => {
    try {
        const { repositoryId } = req.params;
        
        //dữ liệu giả lập github repo
        const repoData = {
            repositoryId: repositoryId,
            name: "skipli-board-management",
            fullName: "trongtinIUH/skipli-board-management",
            description: "Skipli Challenge - Board Management Tool",
            branches: [
                { name: "main", lastCommitSha: "a1b2c3d" },
                { name: "develop", lastCommitSha: "e4f5g6h" },
                { name: "feature/drag-drop", lastCommitSha: "i7j8k9l" }
            ],
            pulls: [
                { title: "Add drag and drop feature", pullNumber: 5 },
                { title: "Fix authentication bug", pullNumber: 4 },
                { title: "Update board UI", pullNumber: 3 }
            ],
            issues: [
                { title: "Implement GitHub integration", issueNumber: 12 },
                { title: "Add member invitation", issueNumber: 11 },
                { title: "Mobile responsive design", issueNumber: 10 }
            ],
            commits: [
                { sha: "a1b2c3d", message: "feat: add drag and drop" },
                { sha: "e4f5g6h", message: "fix: login issue" },
                { sha: "i7j8k9l", message: "refactor: clean up code" }
            ]
        };
        
        res.status(200).json(repoData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//attach github pr/commit/issue vào task
exports.attachGithubToTask = async (req, res) => {
    try {
        const { boardId, cardId, taskId } = req.params;
        const { type, number, sha } = req.body; 
        const userId = req.user.uid;

        //kiểm tra task có tồn tại ko
        const taskRef = db.collection('tasks').doc(taskId);
        const taskDoc = await taskRef.get();
        
        if (!taskDoc.exists) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const attachmentId = uuidv4();
        const newAttachment = {
            attachmentId: attachmentId,
            taskId: taskId,
            type: type, // pull_request, commit, issue
            number: number || null,
            sha: sha || null,
            createdBy: userId,
            createdAt: new Date().toISOString()
        };

        //lưu attachment vào collection riêng
        await db.collection('github_attachments').doc(attachmentId).set(newAttachment);

        res.status(201).json(newAttachment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//lấy danh sách github attachments của task
exports.getGithubAttachments = async (req, res) => {
    try {
        const { taskId } = req.params;

        const snapshot = await db.collection('github_attachments')
            .where('taskId', '==', taskId)
            .get();

        const attachments = snapshot.docs.map(doc => doc.data());
        res.status(200).json(attachments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//xóa github attachment khỏi task
exports.removeGithubAttachment = async (req, res) => {
    try {
        const { attachmentId } = req.params;

        const attachmentRef = db.collection('github_attachments').doc(attachmentId);
        const doc = await attachmentRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Attachment not found' });
        }

        await attachmentRef.delete();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
