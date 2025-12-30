const mongoose = require('mongoose');

const BloodRequestSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  bloodType: { type: String, required: true },
  patientCondition: { type: String, enum: ['critical', 'normal'], default: 'normal' },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BloodRequest', BloodRequestSchema);
