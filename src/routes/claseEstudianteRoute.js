const express = require('express');
const router = express.Router();
const claseEstudianteController = require('../controllers/claseEstudianteController');

// Ruta para unirse a una clase
router.post('/unirse-clase', claseEstudianteController.unirseClase);
router.get('/obtener-clases', claseEstudianteController.obtenerClasesEstudiante);

module.exports = router;
