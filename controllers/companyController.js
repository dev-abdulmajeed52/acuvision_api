// controllers/companyController.js
const Company = require('../models/Company');
const Job = require('../models/Job');

exports.createCompany = async (req, res) => {
  try {
    const company = new Company({ ...req.body, user: req.user.id });
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.postJob = async (req, res) => {
  const { title, description } = req.body;

  try {
    // Find the company associated with the user
    const company = await Company.findOne({ user: req.user.id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found for this user' });
    }

    // Create a new job
    const job = new Job({
      title,
      description,
      company: company._id,
      postedBy: req.user.id,
    });

    await job.save();
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCompanyJobs = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const jobs = await Job.find({ company: company._id }).populate('applications.candidate', 'name');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCompany: exports.createCompany, postJob: exports.postJob, getCompanyJobs: exports.getCompanyJobs };