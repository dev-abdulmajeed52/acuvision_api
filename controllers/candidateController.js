const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const multer = require('multer');
const path = require('path');
const express = require('express');

const app = express();
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'profileImg') {
      cb(null, 'uploads/profile-images/');
    } else if (file.fieldname === 'resume') {
      cb(null, 'uploads/resumes/');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'profileImg') {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
  } else if (file.fieldname === 'resume') {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error('Only PDF files are allowed!'), false);
    }
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).fields([
  { name: 'profileImg', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]);

exports.createProfile = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const experiences = req.body.experiences ? JSON.parse(req.body.experiences) : [];
      const education = req.body.education ? JSON.parse(req.body.education) : [];
      const contactInfo = req.body.contactInfo ? JSON.parse(req.body.contactInfo) : {};

      let totalExperienceYears = 0;
      if (experiences && Array.isArray(experiences)) {
        totalExperienceYears = experiences.reduce((total, exp) => {
          const start = new Date(exp.startDate);
          const end = exp.endDate ? new Date(exp.endDate) : new Date();
          const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
          return total + years;
        }, 0);
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`; // e.g., http://localhost:3000
      const candidateData = {
        name: req.body.name,
        skills: req.body.skills ? req.body.skills.split(',') : [],
        experiences,
        education,
        contactInfo,
        user: req.user.id,
        profileImg: req.files?.profileImg ? `${baseUrl}/${req.files.profileImg[0].path}` : undefined,
        resume: req.files?.resume ? `${baseUrl}/${req.files.resume[0].path}` : undefined,
        totalExperienceYears: Math.round(totalExperienceYears * 10) / 10
      };

      const candidate = new Candidate(candidateData);
      await candidate.save();
      res.status(201).json(candidate);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ user: req.user.id });
    if (!candidate) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      const updateData = {
        ...req.body,
        ...(req.files?.profileImg && { profileImg: req.files.profileImg[0].path }),
        ...(req.files?.resume && { resume: req.files.resume[0].path })
      };
      const candidate = await Candidate.findOneAndUpdate(
        { user: req.user.id },
        updateData,
        { new: true, runValidators: true }
      );
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate profile not found' });
      }
      res.json(candidate);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.applyToJob = async (req, res) => {
  const { jobId } = req.body;
  try {
    const candidate = await Candidate.findOne({ user: req.user.id });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate profile not found' });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const alreadyApplied = job.applications.some(app => app.candidate.toString() === candidate._id.toString());
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }
    job.applications.push({ candidate: candidate._id });
    await job.save();

    res.status(200).json({ message: 'Application submitted successfully', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAvailableJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('company', 'companyName');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProfile: exports.createProfile, applyToJob: exports.applyToJob, getAvailableJobs: exports.getAvailableJobs, getProfile: exports.getProfile, updateProfile:exports.updateProfile };