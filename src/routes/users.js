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

router.route('/').get(protect, authorize('hospital','user'), getUsers).post(createUser);
router.route('/:id').get(protect, authorize('hospital','user'), getUser).put(protect, authorize('user'), updateUser).delete(protect, authorize('user'), deleteUser);

// find nearby requests (open for users)
router.get('/:id/nearby-requests', protect, authorize('user'), getNearbyRequests);

module.exports = router;
