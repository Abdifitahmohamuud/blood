const DonationLog = require('../models/DonationLog');
const User = require('../models/User');

// Create a donation log (only admin or hospital)
exports.createDonation = async (req, res, next) => {
  const { donorId, hospitalId, quantity, notes, donatedAt } = req.body;

  const donor = await User.findById(donorId);
  if (!donor) return res.status(404).json({ success: false, error: 'Donor not found' });

  const createdBy = req.admin ? req.admin._id : req.hospital ? req.hospital._id : null;
  const createdByModel = req.admin ? 'Admin' : req.hospital ? 'Hospital' : null;
  if (!createdBy) return res.status(403).json({ success: false, error: 'Not authorized' });

  const donation = await DonationLog.create({
    donor: donor._id,
    donorSnapshot: {
      fullName: donor.fullName,
      email: donor.email,
      phone: donor.phone,
      bloodType: donor.bloodType,
      location: donor.location,
    },
    hospital: hospitalId,
    quantity: quantity || 1,
    createdBy,
    createdByModel,
    donatedAt: donatedAt || Date.now(),
    notes,
  });

  res.status(201).json({ success: true, data: donation });
};

exports.getDonations = async (req, res, next) => {
  const donations = await DonationLog.find().populate('donor', 'fullName email bloodType').populate('hospital', 'name address');
  res.json({ success: true, count: donations.length, data: donations });
};

exports.getDonation = async (req, res, next) => {
  const donation = await DonationLog.findById(req.params.id).populate('donor', 'fullName email bloodType').populate('hospital', 'name address');
  if (!donation) return res.status(404).json({ success: false, error: 'Donation not found' });
  res.json({ success: true, data: donation });
};

exports.updateDonation = async (req, res, next) => {
  const donation = await DonationLog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!donation) return res.status(404).json({ success: false, error: 'Donation not found' });
  res.json({ success: true, data: donation });
};

exports.deleteDonation = async (req, res, next) => {
  const donation = await DonationLog.findByIdAndDelete(req.params.id);
  if (!donation) return res.status(404).json({ success: false, error: 'Donation not found' });
  res.json({ success: true, data: {} });
};
