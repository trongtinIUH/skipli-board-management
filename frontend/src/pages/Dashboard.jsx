import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {fetchBoards, createBoard, deleteBoard} from "../services/boardService";
import {logout} from "../services/authService";

const Dashboard = ()=>{
    const navigate = useNavigate();
    const [boards, setBoards] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [boardName, setBoardName] = useState('');
    const [boardDesc, setBoardDesc] = useState('');
    const [loading, setLoading] = useState(false);

    // Lấy thông tin user
    const user = JSON.parse(localStorage.getItem('MyUser') || '{}');

    // Load boards khi vào trang
    useEffect(()=>{
        getBoardList();
    }, []);

    const getBoardList = async () => {
        try{
            const data = await fetchBoards();
            setBoards(data || []);
        }catch(error){
            toast.error(error);
        }
    };

    const handleCreateNewBoard = async () => {
        if(!boardName){
            return toast.error('Vui lòng nhập tên board!');
        }
        
        setLoading(true);
        try{
            await createBoard(boardName, boardDesc);
            toast.success('Tạo board thành công!');
            setBoardName('');
            setBoardDesc('');
            setShowCreateModal(false);
            getBoardList();
        }catch(error){
            toast.error(error);
        }finally{
            setLoading(false);
        }
    };

    const handleDeleteBoard = async (e, boardId) => {
        e.stopPropagation();
        if(!window.confirm('Bạn có chắc muốn xóa board này?')) return;

        try{
            await deleteBoard(boardId);
            toast.success('Xóa board thành công!');
            getBoardList();
        }catch(error){
            toast.error(error);
        }
    };

    //xem chi tiết bảng
    const handleDetailBoard = (boardId) => {
        navigate(`/board/${boardId}`);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return(
        <div className="flex h-screen bg-gray-800">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 p-4">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                     <img src="/logo.png" alt="Board Logo"  className='w-10 h-auto'/>
                </div>

                {/* Nav Menu */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded text-white">
                        <span>📊</span>
                        <span>Boards</span>
                    </div>
                    
                    <div className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded cursor-pointer">
                        <span>👥</span>
                        <span>All Members</span>
                    </div>
                </div>

                {/* User Info */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="truncate">{user.email}</div>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-300 text-xs mt-1"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <h1 className="text-gray-400 text-sm uppercase tracking-wide mb-6 font-medium">
                    Your Workspaces
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {/* Các bảng hiện có */}
                    {boards.map((board) => (
                        <div 
                            key={board.id}
                            onClick={() => handleDetailBoard(board.id)}
                            className="h-24 bg-white rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition relative group"
                        >
                            <h3 className="font-medium text-gray-900 truncate">{board.name}</h3>
                            <p className="text-sm text-gray-600 truncate mt-1">
                                {board.description || 'No description'}
                            </p>
                            
                            <button 
                                onClick={(e) => handleDeleteBoard(e, board.id)}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded text-sm opacity-0 group-hover:opacity-100 transition"
                            >
                                ×
                            </button>
                        </div>
                    ))}

                    {/* tạo card mới*/}
                    <div 
                        onClick={() => setShowCreateModal(true)}
                        className="h-24 bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition flex items-center justify-center border-2 border-dashed border-gray-600"
                    >
                        <div className="text-center text-gray-400">
                            <div className="text-lg mb-1">+</div>
                            <div className="text-sm">Create a new board</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Create Board</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Board Title</label>
                                <input 
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={boardName}
                                    onChange={(e) => setBoardName(e.target.value)}
                                    placeholder="Enter board title"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Description</label>
                                <textarea 
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                    value={boardDesc}
                                    onChange={(e) => setBoardDesc(e.target.value)}
                                    placeholder="Enter description"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button 
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleCreateNewBoard}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                {loading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;