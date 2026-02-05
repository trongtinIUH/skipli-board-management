const {db} = require('../config/firebase');
const  {sendOTP} = require('../utils/emailService');

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

module.exports = { signUp };