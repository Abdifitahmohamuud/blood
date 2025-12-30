const Hospital = require('../models/Hospital');

exports.getHospitals = async (req, res, next) => {
  const hospitals = await Hospital.find();
  res.json({ success: true, count: hospitals.length, data: hospitals });
};

exports.getHospital = async (req, res, next) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) return res.status(404).json({ success: false, error: 'Hospital not found' });
  res.json({ success: true, data: hospital });
};

exports.updateHospital = async (req, res, next) => {
  const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!hospital) return res.status(404).json({ success: false, error: 'Hospital not found' });
  res.json({ success: true, data: hospital });
};

exports.deleteHospital = async (req, res, next) => {
  const hospital = await Hospital.findByIdAndDelete(req.params.id);
  if (!hospital) return res.status(404).json({ success: false, error: 'Hospital not found' });
  res.json({ success: true, data: {} });
};
