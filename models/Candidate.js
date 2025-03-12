const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  skills: [String],
  resume: String,
  experience: Number
});

module.exports = mongoose.model('Candidate', candidateSchema);