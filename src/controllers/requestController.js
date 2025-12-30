const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');

// hospital creates a blood request
exports.createRequest = async (req, res, next) => {
  // hospital must be authenticated
  const hospital = req.hospital;
  if (!hospital) return res.status(401).json({ success: false, error: 'Not authenticated as hospital' });

  const { bloodType, patientCondition, quantity, maxDistance } = req.body;
  // create request with hospital location
  const request = await BloodRequest.create({
    hospital: hospital._id,
    bloodType,
    patientCondition,
    quantity,
    location: hospital.location,
  });

  // find donors by matching location string and blood type
  const donorsQuery = {
    bloodType: bloodType,
    availability: true,
    location: hospital.location,
  };
  const donors = await User.find(donorsQuery);

  res.status(201).json({ success: true, data: request, donorsCount: donors.length, donors });
};

exports.getRequests = async (req, res, next) => {
  const requests = await BloodRequest.find().populate('hospital', 'name address');
  res.json({ success: true, count: requests.length, data: requests });
};

exports.getRequest = async (req, res, next) => {
  const request = await BloodRequest.findById(req.params.id).populate('hospital', 'name address');
  if (!request) return res.status(404).json({ success: false, error: 'Request not found' });
  res.json({ success: true, data: request });
};

exports.updateRequest = async (req, res, next) => {
  const request = await BloodRequest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!request) return res.status(404).json({ success: false, error: 'Request not found' });
  res.json({ success: true, data: request });
};

exports.deleteRequest = async (req, res, next) => {
  const request = await BloodRequest.findByIdAndDelete(req.params.id);
  if (!request) return res.status(404).json({ success: false, error: 'Request not found' });
  res.json({ success: true, data: {} });
};
