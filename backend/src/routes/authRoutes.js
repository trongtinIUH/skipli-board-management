const express = require('express');
const router = express.Router();
const authenController = require('../controllers/authController');

router.post('/signup', authenController.signUp);

module.exports = router;

