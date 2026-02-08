import axios from 'axios';
import { getAuthHeader } from './authService';

const API_URL = import.meta.env.VITE_API_URL;

// Lấy danh sách Task của 1 Cột
export const fetchTasks = async (boardId, cardId) => {
  try {
    const response = await axios.get(
      `${API_URL}/boards/${boardId}/cards/${cardId}/tasks`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Fetch Tasks Error:", error);
    return []; // Trả về mảng rỗng nếu lỗi để không crash app
  }
};

// Tạo Task mới
export const createTask = async (boardId, cardId, title) => {
  try {
    const response = await axios.post(
      `${API_URL}/boards/${boardId}/cards/${cardId}/tasks`,
      { title },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Lỗi tạo task";
  }
};

// Cập nhật Task (Dùng để chuyển cột hoặc đổi tên)
export const updateTask = async (boardId, cardId, taskId, data) => {
  try {
    const response = await axios.put(
      `${API_URL}/boards/${boardId}/cards/${cardId}/tasks/${taskId}`, 
      data,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Lỗi cập nhật task";
  }
};