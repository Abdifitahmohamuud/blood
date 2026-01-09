const Admin = require('../models/Admin');

exports.createAdmin = async (req, res, next) => {
  const admin = await Admin.create(req.body);
  res.status(201).json({ success: true, data: admin });
};

exports.getAdmins = async (req, res, next) => {
  const admins = await Admin.find();
  res.json({ success: true, count: admins.length, data: admins });
};

exports.getAdmin = async (req, res, next) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) return res.status(404).json({ success: false, error: 'Admin not found' });
  res.json({ success: true, data: admin });
};

exports.updateAdmin = async (req, res, next) => {
  const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!admin) return res.status(404).json({ success: false, error: 'Admin not found' });
  res.json({ success: true, data: admin });
};

exports.deleteAdmin = async (req, res, next) => {
  const admin = await Admin.findByIdAndDelete(req.params.id);
  if (!admin) return res.status(404).json({ success: false, error: 'Admin not found' });
  res.json({ success: true, data: {} });
};
