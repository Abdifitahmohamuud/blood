const express = require('express');
const router = express.Router();
const { userSignup, userLogin, hospitalSignup, hospitalLogin, adminSignup, adminLogin } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// User auth
router.post('/user/signup', userSignup);
router.post('/user/login', userLogin);

// Admin auth
router.post('/admin/signup', protect, authorize('admin'), adminSignup);
router.post('/admin/login', adminLogin);

// Hospital auth - creation must be performed by admin
router.post('/hospital/signup', protect, authorize('admin'), hospitalSignup);
router.post('/hospital/login', hospitalLogin);

module.exports = router;
