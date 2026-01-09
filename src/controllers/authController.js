const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// Signup for User
exports.userSignup = async (req, res, next) => {
  const { fullName, email, phone, password, bloodType, location, availability } = req.body;
  const user = await User.create({ fullName, email, phone, password, bloodType, location, availability });
  const token = generateToken({ id: user._id, role: 'user' });
  res.status(201).json({ success: true, data: user, token });
};

// Login for User
exports.userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(400).json({ success: false, error: 'Invalid credentials' });
  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(400).json({ success: false, error: 'Invalid credentials' });
  const token = generateToken({ id: user._id, role: 'user' });
  res.json({ success: true, data: user, token });
};

// Signup for Hospital
exports.hospitalSignup = async (req, res, next) => {
  const { name, email, phone, password, address, location } = req.body;
  const hospital = await Hospital.create({ name, email, phone, password, address, location });
  const token = generateToken({ id: hospital._id, role: 'hospital' });
  res.status(201).json({ success: true, data: hospital, token });
};

// Login for Hospital
exports.hospitalLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const hospital = await Hospital.findOne({ email }).select('+password');
  if (!hospital) return res.status(400).json({ success: false, error: 'Invalid credentials' });
  const isMatch = await hospital.matchPassword(password);
  if (!isMatch) return res.status(400).json({ success: false, error: 'Invalid credentials' });
  const token = generateToken({ id: hospital._id, role: 'hospital' });
  res.json({ success: true, data: hospital, token });
};

// Admin signup
exports.adminSignup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const admin = await Admin.create({ name, email, password });
  const token = generateToken({ id: admin._id, role: 'admin' });
  res.status(201).json({ success: true, data: admin, token });
};

// Admin login
exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin) return res.status(400).json({ success: false, error: 'Invalid credentials' });
  const isMatch = await admin.matchPassword(password);
  if (!isMatch) return res.status(400).json({ success: false, error: 'Invalid credentials' });
  const token = generateToken({ id: admin._id, role: 'admin' });
  res.json({ success: true, data: admin, token });
};
