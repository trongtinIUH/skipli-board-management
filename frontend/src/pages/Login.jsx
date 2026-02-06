import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {sendOTP, verifyOTP} from "../services/authService";

const Login = ()=>{
    const navigate = useNavigate();
    const [step, setStep] = useState('EMAIL'); 
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    //hàm gửi email
    const handleSendEmail = async (e) => {
        if(!email){return toast.error('Vui lòng nhập email của bạn !');}
        
        setLoading(true);
        try{
            await sendOTP(email);
            toast.success('Mã OTP đã được gửi đến email của bạn !');
            setStep('OTP');
        }catch(error){
            toast.error(error || 'Lỗi kết nối Server.');
        }finally{
            setLoading(false);
        }
    };
    //hàm xác thực OTP
    const handleVerifyOTP = async (e) => {
        if(!otp){return toast.error('Vui lòng nhập mã OTP của bạn !');}
        setLoading(true);
        try{
            const res = await verifyOTP(email, otp);
            toast.success('Đăng nhập thành công !');
            navigate('/dashboard');
        }catch(error){
            toast.error(error || 'OTP không đúng');
        }finally{
            setLoading(false);
        }
    };


    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            {/* Hình mẫu góc trái */}
            <img src="/login_trai.png" alt="Login pic"
            className="absolute left-0 bottom-0 w-60 h-auto"/>
            {/* Hình mẫu góc phải */}
            <img src="/login_phai.png" alt="Login pic"
            className="absolute right-0 bottom-0 w-60 h-auto"/>

            {/* Form đăng nhập */}
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md z-10">
                {/*Logo của form */}
                <div className="flex justify-center mb-6">
                <img src="/logo.png" alt="Logo" className="w-16 h-16" />
                </div>
                {/* Tiêu đề form */}
                <h2 className="text-center text-2xl font-bold text-gray-700 mb-2">
                     {step === 'EMAIL' ? 'Log in to continue' : 'Email Verification'}
                </h2>
                {step ==='OTP' &&(
                <p className="text-center text-sm text-gray-600 mb-6">
                     Please enter your code sent to {email}
                </p> 
                )}

                {/* Form */}
                <div className="space-y-4">
                    {step === 'EMAIL' ? (
                        <>
                            <input type="email"
                            className="w-full px-4 py-4 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none " 
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            />
                            <button 
                            onClick={handleSendEmail}
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:bg-gray-400">
                                {loading ? 'Sending...' : 'Continue'}
                            </button>
                        </>
                    ): (
                        <>
                        <input type="text"
                        className="w-full px-4 py-3 text-center text-xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="------"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        />
                        
                        <button 
                        onClick={handleVerifyOTP} 
                        disabled= {loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:bg-gray-400"
                        >{loading ? 'Verifying...' : 'Submit'}
                        </button>

                        <button 
                        onClick={()=> setStep('EMAIL')}
                        className="w-full text-sm text-gray-500 hover:text-blue-600 underline">
                            Change email address
                        </button>
                        </>
                    )} 
                </div>

                {/* Footer */}
                <div className="text-center mt-2">
                <p className="text-center font-bold text-gray-500 text-sm ">Privacy Policy</p>
                
                <p className="text-center text-xs text-gray-400">
                     This site is protected by reCAPTCHA and the Google Privacy <br />
                     <span className="text-blue-600 text-xs cursor-pointer hover:text-blue-800"> Policy and Terms of Service apply</span>
                </p>
                
                </div>
               
                
            </div>
        </div>
    );
};

export default Login;