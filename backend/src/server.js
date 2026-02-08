require('dotenv').config();
require('./config/firebase');

const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const boardRoutes = require('./routes/boardRoutes');
const listRoutes = require('./routes/listRoutes');
const githubRoutes = require('./routes/githubRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

//1 cấu hình middleware
app.use(cors({
    origin: [ 'http://localhost:5173'], 
    credentials: true
}));
app.use(express.json());


//-- cấu hình routes api--
//signup route
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/boards/:boardId/cards', listRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/users', userRoutes);





//2 khởi tạo server HTTP dùng socket.io
const server = http.createServer(app);

//3 khởi tạo socket.io
const io = new Server(server, {
    cors:{
        origin : '*', 
        methods : ['GET', 'POST']
    }
});

//4 xử lý kết nối socket.io
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

        socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
});
});


//5 test API
app.get('/', (req, res) => {
    res.send('Server Backend Skipli Challenge is running');
});

//6 start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});