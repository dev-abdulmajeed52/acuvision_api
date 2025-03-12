const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const superadminController = require('../controllers/superadminController');

router.get(
  '/all-data',
  authMiddleware,
  roleMiddleware(['superadmin']),
  superadminController.getAllData
);

module.exports = router;