const express = require('express');
const router = express.Router();
const docenteController = require('../controllers/docenteController');

// Definir las rutas de los docentes
router.post('/registro', docenteController.registrarDocente);
router.get('/', docenteController.obtenerDocentes);

module.exports = router;
