const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');
const validarEstudiante = require('../middlewares/validarEstudiante');
const validarEstudianteDuplicado = require('../middlewares/validarEstudianteDuplicado');


router.post('/registro', validarEstudiante,validarEstudianteDuplicado,estudianteController.registrarEstudiante);
router.get('/', estudianteController.obtenerEstudiantes);

module.exports = router;
