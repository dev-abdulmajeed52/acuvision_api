// routes/companyRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { createCompany, postJob, getCompanyJobs } = require('../controllers/companyController');

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['company']),
  createCompany
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