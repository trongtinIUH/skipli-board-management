import axios from "axios";
import { getAuthHeader } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

//lấy thông tin github repo
export const getGithubRepoInfo = async (repositoryId) => {
    try {
        const response = await axios.get(
            `${API_URL}/github/repositories/${repositoryId}/github-info`,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Lỗi lấy thông tin GitHub";
    }
};

//attach github vào task
export const attachGithubToTask = async (boardId, cardId, taskId, attachData) => {
    try {
        const response = await axios.post(
            `${API_URL}/github/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attach`,
            attachData,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Lỗi attach GitHub";
    }
};

//lấy attachments của task
export const getGithubAttachments = async (boardId, cardId, taskId) => {
    try {
        const response = await axios.get(
            `${API_URL}/github/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attachments`,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || "Lỗi lấy attachments";
    }
};

//xóa attachment
export const removeGithubAttachment = async (boardId, cardId, taskId, attachmentId) => {
    try {
        await axios.delete(
            `${API_URL}/github/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attachments/${attachmentId}`,
            getAuthHeader()
        );
    } catch (error) {
        throw error.response?.data?.error || "Lỗi xóa attachment";
    }
};
