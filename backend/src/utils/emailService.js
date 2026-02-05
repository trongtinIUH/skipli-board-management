const nodemailer = require('nodemailer');
require('dotenv').config();

//cấu hình mail server
const tranporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

//hàm gửi otp qua email
const sendOTP = async (email, otp) => {
    try{
        await tranporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Skipli Challenge - Login Verification Code',
            text: `Your OTP code is: ${otp}`,
            html:`
                <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
                    <h2>Your OTP Code Verification</h2>
                    <p>Pls use the following code to sign in: </p>
                    <h1 style="color: #333;">${otp}</h1>
                    <p>This code is valid for 5 minutes. If you did not request this code, please ignore this email.</p>
                </div>
            `
        });
        console.log('OTP email sent successfully to', email);
        return true;
    }catch(error){
        console.error('Error sending OTP email:', error);
        return false;
    }
}
module.exports = { sendOTP };