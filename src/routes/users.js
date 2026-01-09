const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getNearbyRequests,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(protect, authorize('admin'), getUsers).post(protect, authorize('admin'), createUser);
router.route('/:id').get(protect, authorize('admin'), getUser).put(protect, authorize('admin'), updateUser).delete(protect, authorize('admin'), deleteUser);

// find nearby requests (open for users)
router.get('/:id/nearby-requests', protect, authorize('user'), getNearbyRequests);

module.exports = router;
