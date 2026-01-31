const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createDonation, getDonations, getDonation, updateDonation, deleteDonation } = require('../controllers/donationController');

router.route('/').get(protect, authorize('admin','hospital'), getDonations).post(protect, authorize('admin','hospital'), createDonation);
router.route('/:id').get(protect, authorize('admin','hospital'), getDonation).put(protect, authorize('admin','hospital'), updateDonation).delete(protect, authorize('admin','hospital'), deleteDonation);

module.exports = router;
