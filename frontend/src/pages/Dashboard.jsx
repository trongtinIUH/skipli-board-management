import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    //xóa token và user khi logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('MyUser');
        navigate('/login');
    };

    return(
        <div className="p-10 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold text-blue-600">Skipli Dashboard</h1>
                <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                >
                    Đăng xuất
                </button>

                <div className="bg-white p-6 rounded shadow-md">
                    <p className="text-gray-700">Chào mừng bạn đã đăng nhập thành công!</p>
                    <p className="text-gray-500 text-sm mt-2">Khu vực này sẽ hiển thị danh sách Board.</p>
                </div>
            </div>
        </div>
    );

};

export default Dashboard;