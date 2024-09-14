const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');
const validarEstudiante = require('../middlewares/validarEstudiante');

router.post('/registro', validarEstudiante, estudianteController.registrarEstudiante);
router.get('/', estudianteController.obtenerEstudiantes);

module.exports = router;
