const express = require('express');
const router = express.Router();
const { createRequest, getRequests, getRequest, updateRequest, deleteRequest } = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getRequests).post(protect, authorize('hospital'), createRequest);
router.route('/:id').get(getRequest).put(protect, authorize('hospital'), updateRequest).delete(protect, authorize('hospital'), deleteRequest);

module.exports = router;
