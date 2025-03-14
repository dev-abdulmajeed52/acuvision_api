const Company = require('../models/Company');
const Job = require('../models/Job');

exports.createCompany = async (req, res) => {
  const { companyName, address, industry, hrName,hrPhone, hrEmail, companyEmail, companyPhone, website, country,city } = req.body;
  if (!companyName || !address || !hrName || !hrEmail || !companyEmail || !industry) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }
  try {
    const existingCompany = await Company.findOne({ user: req.user.id });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company already exists for this user' });
    }
    const company = new Company({ ...req.body, user: req.user.id });
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating company' });
  }
};
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find(); 
    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching companies' });
  }
};
exports.postJob = async (req, res) => {
  const { title, description, } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }
  try {
    const company = await Company.findOne({ user: req.user.id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found for this user' });
    }
    const job = new Job({
      title,
      description,
      company: company._id,
      postedBy: req.user.id,
    });

    await job.save();
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while posting job' });
  }
};


exports.getCompanyJobs = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    const jobs = await Job.find({ company: company._id })
      .populate('applications.candidate', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
};
