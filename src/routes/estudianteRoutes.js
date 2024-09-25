const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');
const validarEstudiante = require('../middlewares/validarEstudiante');
const validarPassword = require('../middlewares/validarPassword');
const validarEstudianteDuplicado = require('../middlewares/validarEstudianteDuplicado');  // Mantener ambos middlewares

router.post('/registro', validarEstudiante, validarEstudianteDuplicado, estudianteController.registrarEstudiante);
router.get('/', estudianteController.obtenerEstudiantes);
router.post('/cambiar-password', validarPassword, estudianteController.setPassword);

module.exports = router;
