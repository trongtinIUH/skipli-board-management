import { io } from 'socket.io-client';

// lấy url socket server từ env, bỏ phần /api
const SOCKET_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:5000';

let socket = null;

// kết nối socket
export function connectSocket() {
    if (!socket) {
        socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    }
    return socket;
}

// lấy socket instance
export function getSocket() {
    return socket;
}

// lấy socket id để gửi kèm trong header API
export function getSocketId() {
    if (socket && socket.connected) {
        return socket.id;
    }
    return null;
}

// join vào room của 1 board
export function joinBoard(boardId) {
    if (socket && socket.connected) {
        socket.emit('join-board', boardId);
        console.log('Joined board room:', boardId);
    }
}

// rời room khi thoát board
export function leaveBoard(boardId) {
    if (socket && socket.connected) {
        socket.emit('leave-board', boardId);
        console.log('Left board room:', boardId);
    }
}

// ngắt kết nối socket
export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
