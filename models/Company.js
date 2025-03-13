const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  location: String,
  address: { type: String, required: true },
  industry: String,
  hrName: { type: String, required: true },
  hrEmail: { type: String, required: true },
  hrPhone: { type: String },
  companyEmail: { type: String, required: true },
  companyPhone: { type: String },
  website: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
