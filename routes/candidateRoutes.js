const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { createProfile, applyToJob, getAvailableJobs } = require('../controllers/candidateController');

router.post(
  '/profile',
  authMiddleware,
  roleMiddleware(['candidate']),
  createProfile
);

router.post(
  '/apply',
  authMiddleware,
  roleMiddleware(['candidate']),
  applyToJob
);

router.get(
  '/jobs',
  authMiddleware,
  roleMiddleware(['candidate']),
  getAvailableJobs
);

module.exports = router;