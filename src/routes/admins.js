const express = require('express');
const router = express.Router();
const { createAdmin, getAdmins, getAdmin, updateAdmin, deleteAdmin } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(protect, authorize('admin'), getAdmins).post( authorize('admin'), createAdmin);
router.route('/:id').get(protect, authorize('admin'), getAdmin).put(protect, authorize('admin'), updateAdmin).delete(protect, authorize('admin'), deleteAdmin);

module.exports = router;
