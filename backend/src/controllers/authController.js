const {db} = require('../config/firebase');
const  {sendOTP} = require('../utils/emailService');
const jwt  = require('jsonwebtoken');

//hàm xử lý gửi otp| signUp với email
const signUp = async (req, res) => {
    try{
        const { email } = req.body;
        if(!email){
            return res.status(400).json({ message: 'Email is required' });
        }
        //tạo otp ngẫu nhiên gồm 6 chữ số
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        //có hiệu lực 5 phút
        const expAt = Date.now() + 5 * 60 * 1000;
        //lưu otp vào firestore
        await db.collection('users').doc(email).set({
            email: email,
            otp: otp,
            expAt: expAt,
            createAt: new Date().toISOString()
        }, {merge: true });

        //gửi otp qua email
        const emailSent = await sendOTP(email, otp);
        if(!emailSent){
            return  res.status(500).json({ error: 'Failed to send verification email' });
        }

        res.status(200).json({ message: 'Verification code sent to email!' });
    }catch(error){
        console.error('Error in signUp:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


//hàm xử lý signin với email + Verify otp
const signIn = async (req, res) => {
    try{
        //1 check đầu vào
        const { email, verificationCode } = req.body;
        if(!email || !verificationCode){
            return res.status(400).json({ error: 'Email and verification code are required' });
        }
        //2 lấy info user từ firestore
        const userRef = db.collection('users').doc(email);
        const doc = await userRef.get();

        if(!doc.exists){
            return res.status(404).json({ error: 'User not found. Please sign up first' });
        }
        const userData = doc.data();

        //3 kiểm tra otp có khớp không
        if(userData.otp !== verificationCode){
            return res.status(400).json({ error: 'Invalid verification code' });
        }
        //4 kiểm tra otp còn hạn không
        if(userData.expAt < Date.now()){
            return res.status(400).json({ error: 'Verification code expired' });
        }
        //5 tạo jwt token
        const token = jwt.sign(
            { uid: email , email: email }, // token này sẽ chuaa thông tin uid và email
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // token có hạn 7 ngày 
        );

        //6 xóa otp đã dùng 
        await userRef.update({
            otp: null,
            expAt: null
        });

        //7 trả về token cho client
        res.status(200).json({ 
            message: 'Login successful',
            token: token,
            user:{
                email: email,
                uid: email
            }
         });

         
    }catch(error){
        console.error('Error in signIn:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { signUp, signIn };