const express = require('express');
const router = express.Router();
const { getPrueba } = require('../controllers/healthyController');

// Cambiar la ruta a "/"
router.get('/', getPrueba);

module.exports = router;