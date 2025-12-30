const express = require('express');
const router = express.Router();
const { userSignup, userLogin, hospitalSignup, hospitalLogin } = require('../controllers/authController');

// User auth
router.post('/user/signup', userSignup);
router.post('/user/login', userLogin);

// Hospital auth
router.post('/hospital/signup', hospitalSignup);
router.post('/hospital/login', hospitalLogin);

module.exports = router;
