const express = require('express');
const router = express.Router();
const { getHospitals, getHospital, updateHospital, deleteHospital } = require('../controllers/hospitalController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(protect, authorize('admin'), getHospitals);
router.route('/:id').get(protect, authorize('admin'), getHospital).put(protect, authorize('admin'), updateHospital).delete(protect, authorize('admin'), deleteHospital);

module.exports = router;