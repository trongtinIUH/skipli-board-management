import axios  from "axios";
import { getAuthHeader } from "./authService";
const API_URL = import.meta.env.VITE_API_URL;

//1 lấy danh sách bảng
export const fetchBoards = async () => {
    try{
        const response = await axios.get(`${API_URL}/boards`, getAuthHeader());
        return response.data;
    }catch(error){
       throw error.response?.data?.error || "Lỗi tải danh sách bảng";
    }
};

//2 tạo bảng mới
export const createBoard = async (name, description) => {
    try{
        const response = await axios.post(`${API_URL}/boards`, 
        { name, description }, 
        getAuthHeader(),);
        return response.data;
    }catch(error){
        throw error.response?.data?.error || "Lỗi tạo bảng";
    }
};

// 3 xóa bảng
export const deleteBoard = async (boardId) => {
    try{
        const response = await axios.delete(`${API_URL}/boards/${boardId}`, getAuthHeader());
        return response.data;
    }catch(error){
        throw error.response?.data?.error || "Lỗi xóa bảng";
    }
};

//4 cập nhật bảng
export const updateBoard = async (boardId, name, description) => {
    try{
        const response = await axios.put(`${API_URL}/boards/${boardId}`, 
        { name, description }, 
        getAuthHeader());
        return response.data;
    }catch(error){
        throw error.response?.data?.error || "Lỗi cập nhật bảng";
    }  
};

//5 lấy chi tiết bảng
export const getBoardById = async (boardId) => {
    try{
        const response = await axios.get(`${API_URL}/boards/${boardId}`, getAuthHeader());
        return response.data;
    }catch(error){
        throw error.response?.data?.error || "Lỗi tải chi tiết bảng";
    }
};