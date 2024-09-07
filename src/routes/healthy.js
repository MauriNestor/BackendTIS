// src/routes/healthy.js
const express = require('express');
const router = express.Router();
const { getHealthy } = require('../controllers/healthyController');

router.get('/', getHealthy);

module.exports = router;
