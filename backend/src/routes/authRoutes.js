const express = require('express');
const router = express.Router();
const authenController = require('../controllers/authController');

router.post('/signup', authenController.signUp);
router.post('/signin', authenController.signIn);

module.exports = router;

