const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { createCompany, postJob, getCompanyJobs,getAllCompanies } = require('../controllers/companyController');

router.post(
  '/register-company',
  authMiddleware,
  roleMiddleware(['company']),
  createCompany
);

router.get('/companies', 
  authMiddleware,
  roleMiddleware(['company']),
  getAllCompanies
);


router.post(
  '/jobs',
  authMiddleware,
  roleMiddleware(['company']),
  postJob
);

router.get(
  '/jobs',
  authMiddleware,
  roleMiddleware(['company']),
  getCompanyJobs
);

module.exports = router;