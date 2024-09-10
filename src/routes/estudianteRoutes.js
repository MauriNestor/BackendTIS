const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');

// Ruta para registrar un estudiante
router.post('/registro', estudianteController.registrarEstudiante);

// Ruta para obtener todos los estudiantes
router.get('/', estudianteController.obtenerEstudiantes);

module.exports = router;
