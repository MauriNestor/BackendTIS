const express = require('express');
const { autenticarDocente } = require('../controllers/loginController'); 
const { autenticarEstudiante } = require('../controllers/loginController'); 
const router = express.Router();

// Definir la ruta para la autenticación del docente
router.get('/docente', autenticarDocente);
router.get('/estudiante', autenticarEstudiante);

module.exports = router;
