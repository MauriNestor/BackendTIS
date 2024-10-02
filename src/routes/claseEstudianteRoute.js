const express = require('express');
const router = express.Router();
const claseEstudianteController = require('../controllers/claseEstudianteController');
const verificarToken = require('../middlewares/verificarToken');

// Ruta para unirse a una clase
router.post('/unirse-clase',verificarToken, claseEstudianteController.unirseClase);
router.get('/obtener-clases',verificarToken, claseEstudianteController.obtenerClasesEstudiante);

module.exports = router;
