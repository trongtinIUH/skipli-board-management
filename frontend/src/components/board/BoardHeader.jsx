import React, { useState } from 'react';
import { inviteUserToBoard } from '../../services/boardService';
import { toast } from 'react-toastify';

const BoardHeader = ({ board, onCloseBoard }) => {
    const [showInvite, setShowInvite] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [isInviting, setIsInviting] = useState(false);

    const handleInvite = async () => {
        if (!inviteEmail) {
            toast.error('Vui lòng nhập email!');
            return;
        }

        setIsInviting(true);
        try {
            await inviteUserToBoard(board.id, inviteEmail);
            toast.success(`Đã mời ${inviteEmail} vào bảng!`);
            setInviteEmail('');
            setShowInvite(false);
        } catch (error) {
            toast.error(error);
        } finally {
            setIsInviting(false);
        }
    };

    return (
        <div className="flex items-center justify-between px-6 py-3 bg-black/20 backdrop-blur-md text-white">
            <div className="flex items-center gap-4">
                <img src="/logo.png" alt="Board Logo" className='w-10 h-auto'/>
                <h1 className="text-xl font-bold font-sans tracking-wide">
                    {board?.name || 'Loading Board...'}
                </h1>
                <span className="text-xs px-2 py-1 bg-white/20 rounded-md text-blue-100">
                    {board?.visibility || 'Private'}
                </span>
            </div>
            
            <div className="flex items-center gap-3 relative">
                {/* Member Avatar */}
                <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs">A</div>
                    <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-xs">B</div>
                </div>
                
                <button 
                    className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-sm transition font-medium"
                    onClick={() => setShowInvite(!showInvite)}
                >
                    Invite
                </button>
                
                {showInvite && (
                    <div className="absolute top-12 right-0 bg-white p-4 rounded-lg shadow-xl w-72 text-black z-50">
                        <p className="text-sm font-bold mb-3">Mời thành viên vào board</p>
                        <input 
                            className="w-full border border-gray-300 p-2 rounded text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="Nhập email của thành viên..."
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleInvite()}
                        />
                        <div className="flex gap-2">
                            <button 
                                onClick={handleInvite}
                                className="flex-1 bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                                disabled={!inviteEmail || isInviting}
                            >
                                {isInviting ? 'Đang mời...' : 'Gửi lời mời'}
                            </button>
                            <button 
                                onClick={() => {
                                    setShowInvite(false);
                                    setInviteEmail('');
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                )}
                
                <button 
                    onClick={onCloseBoard}
                    className="bg-red-500/80 hover:bg-red-600 px-3 py-1.5 rounded text-sm transition font-medium"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default BoardHeader;