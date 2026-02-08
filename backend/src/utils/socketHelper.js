// helper để emit socket event từ controller
// dùng req.app.get('io') để lấy instance socket.io

function emitToBoard(req, boardId, event, data) {
    const io = req.app.get('io');
    if (!io) return;

    const room = `board:${boardId}`;
    const senderSocketId = req.headers['x-socket-id'];

    // gửi cho tất cả user trong board room, trừ người gửi request
    // vì người gửi đã cập nhật UI rồi nên ko cần nhận lại
    if (senderSocketId) {
        const senderSocket = io.sockets.sockets.get(senderSocketId);
        if (senderSocket) {
            senderSocket.to(room).emit(event, data);
            return;
        }
    }

    // fallback nếu ko tìm thấy socket của sender -> gửi cho tất cả
    io.to(room).emit(event, data);
}

module.exports = { emitToBoard };
