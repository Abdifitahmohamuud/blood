const mongoose = require('mongoose');

const DonationLogSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donorSnapshot: {
    fullName: { type: String },
    email: { type: String },
    phone: { type: String },
    bloodType: { type: String },
    location: { type: String },
  },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  quantity: { type: Number, default: 1 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, refPath: 'createdByModel' },
  createdByModel: { type: String, enum: ['Admin', 'Hospital'] },
  donatedAt: { type: Date, default: Date.now },
  notes: { type: String },
});

module.exports = mongoose.model('DonationLog', DonationLogSchema);
