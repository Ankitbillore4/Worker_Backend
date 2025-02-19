const express = require('express');
const { createJob, getJobs } = require('../controllers/jobController');
const authMiddleware = require("../middlewares/authMiddleware");


const router = express.Router();
  
router.post('/create', authMiddleware, createJob);
router.get('/list', getJobs); 

module.exports = router;
