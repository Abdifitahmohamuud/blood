const express = require('express');
const router = express.Router();
const { getHospitals, getHospital, updateHospital, deleteHospital } = require('../controllers/hospitalController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getHospitals);
router.route('/:id').get(getHospital).put(protect, authorize('hospital'), updateHospital).delete(protect, authorize('hospital'), deleteHospital);

module.exports = router;