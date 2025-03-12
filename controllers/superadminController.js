const Candidate = require('../models/Candidate');
const Company = require('../models/Company');

exports.getAllData = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    const companies = await Company.find();
    res.json({ candidates, companies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};