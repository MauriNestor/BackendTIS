const express = require('express');
const router = express.Router();
const gestionController = require('../controllers/gestionController');

router.get('/', gestionController.obtenerGestiones);

module.exports = router;
