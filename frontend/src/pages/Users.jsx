import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, updateUser } from '../services/userService';
import { toast } from 'react-toastify';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [newName, setNewName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setNewName(user.displayName || '');
    };

    const handleSave = async () => {
        if (!editingUser || !newName.trim()) return;
        
        try {
            await updateUser(editingUser.id, { displayName: newName });
            toast.success('Cập nhật thành công!');
            setEditingUser(null);
            loadUsers();
        } catch (error) {
            toast.error(error);
        }
    };

    const handleCancel = () => {
        setEditingUser(null);
        setNewName('');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl text-gray-600">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                        <h1 className="text-xl font-bold text-gray-800">Danh sách Users</h1>
                    </div>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Về Dashboard
                    </button>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">Tổng cộng: {users.length} users</h2>
                    </div>
                    
                    <div className="divide-y">
                        {users.map(user => (
                            <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                        {(user.displayName || user.email)[0].toUpperCase()}
                                    </div>
                                    
                                    {/* Info */}
                                    <div>
                                        {editingUser?.id === user.id ? (
                                            <input 
                                                type="text"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                className="border rounded px-2 py-1 text-sm"
                                                placeholder="Tên hiển thị"
                                            />
                                        ) : (
                                            <div className="font-medium text-gray-800">
                                                {user.displayName || 'Chưa đặt tên'}
                                            </div>
                                        )}
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {editingUser?.id === user.id ? (
                                        <>
                                            <button 
                                                onClick={handleSave}
                                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                                            >
                                                Lưu
                                            </button>
                                            <button 
                                                onClick={handleCancel}
                                                className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
                                            >
                                                Hủy
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => handleEdit(user)}
                                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-200"
                                        >
                                            Sửa
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {users.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            Chưa có user nào trong hệ thống
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Users;
