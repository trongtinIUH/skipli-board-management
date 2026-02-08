import axios from "axios";
import { getAuthHeader } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

//lấy tất cả users
export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Lỗi lấy danh sách users";
    }
};

//lấy thông tin user theo id
export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/users/${userId}`, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Lỗi lấy thông tin user";
    }
};

//cập nhật thông tin user
export const updateUser = async (userId, userData) => {
    try {
        const response = await axios.put(
            `${API_URL}/users/${userId}`,
            userData,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Lỗi cập nhật thông tin";
    }
};

//lấy members của board
export const getBoardMembers = async (boardId) => {
    try {
        const response = await axios.get(
            `${API_URL}/users/boards/${boardId}/members`,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Lỗi lấy danh sách members";
    }
};
