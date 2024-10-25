const express = require('express');
const router = express.Router();
const gestionController = require('../controllers/gestionController');
const verificarToken = require('../middlewares/verificarToken');

router.get('/',verificarToken, gestionController.obtenerGestiones);

module.exports = router;
