import axios from 'axios';
import { getAuthHeader } from './authService';

const API_URL = import.meta.env.VITE_API_URL;

// Lấy danh sách Cột của 1 Board
export const fetchCards = async (boardId) => {
  try {
    const response = await axios.get(
      `${API_URL}/boards/${boardId}/cards`, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Lỗi tải danh sách cột";
  }
};

// Tạo Cột mới
export const createCard = async (boardId, name) => {
  try {
    const response = await axios.post(
      `${API_URL}/boards/${boardId}/cards`,
      { name },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Lỗi tạo cột";
  }
};