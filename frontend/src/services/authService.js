import axios  from "axios";

//dọc từ dotenv
const API_URL = import.meta.env.VITE_API_URL;

//hàm gửi otp đến email
export const sendOTP = async (email) => {
    try{
        const response  = await axios.post(`${API_URL}/auth/signup`, { email });
        return response.data;
    }catch(error){
        throw error.response?.data?.error || 'Lỗi kết nối Server.';
    }
};

//hàm xác thực otp đăng nhập
export const verifyOTP = async (email, otp) => {
    try{
        const response = await axios.post(`${API_URL}/auth/signin`, 
        { 
            email,
            verificationCode: otp 
        });

        //lưu token vào localstorage
        if(response.data.token){
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('MyUser', JSON.stringify(response.data));
        }
        return response.data;
    }catch(error){
        throw error.response?.data?.error || 'Mã OTP không đúng hoặc đã hết hạn.';
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('MyUser');
};