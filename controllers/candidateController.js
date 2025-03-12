// controllers/candidateController.js
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');

exports.createProfile = async (req, res) => {
  try {
    const candidate = new Candidate({ ...req.body, user: req.user.id });
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.applyToJob = async (req, res) => {
  const { jobId } = req.body;

  try {
    // Find the candidate associated with the user
    const candidate = await Candidate.findOne({ user: req.user.id });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate profile not found' });
    }

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if candidate already applied
    const alreadyApplied = job.applications.some(app => app.candidate.toString() === candidate._id.toString());
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    // Add application
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

module.exports = { createProfile: exports.createProfile, applyToJob: exports.applyToJob, getAvailableJobs: exports.getAvailableJobs };