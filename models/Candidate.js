const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date }, // Optional, null if current job
  responsibilities: [String],
  location: String
});

const candidateSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  profileImg: {
    type: String, // Will store the file path or URL
    default: 'default-profile.jpg'
  },
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  skills: [{
    type: String,
    trim: true
  }],
  resume: {
    type: String,
  },
  experiences: [experienceSchema],
  education: [{
    institution: String,
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date
  }],
  contactInfo: {
    email: { type: String, },
    phone: String,
    linkedin: String,
    portfolio: String
  },
  totalExperienceYears: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);