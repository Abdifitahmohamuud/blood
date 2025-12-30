const User = require('../models/User');

exports.createUser = async (req, res, next) => {
  // for admin style creation - but we have signup route for users
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find();
  res.json({ success: true, count: users.length, data: users });
};

exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, data: user });
};

exports.updateUser = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, data: user });
};

exports.deleteUser = async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, data: {} });
};

// Get nearby blood requests for a user
exports.getNearbyRequests = async (req, res, next) => {
  // Using string locations: either provide ?location=LocationName or use user's saved location
  const locationParam = req.query.location;
  const bloodType = req.query.bloodType;

  let locationToSearch = locationParam;
  if (!locationToSearch) {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    locationToSearch = user.location;
  }
  if (!locationToSearch) return res.status(400).json({ success: false, error: 'Location is required (query or user profile)' });

  const query = { location: locationToSearch };
  if (bloodType) query.bloodType = bloodType;
  const BloodRequest = require('../models/BloodRequest');
  const requests = await BloodRequest.find(query).populate('hospital', 'name address location');
  res.json({ success: true, count: requests.length, data: requests });
};
