const express = require('express');
const router = express.Router();
const claseController = require('../controllers/claseController');
const validarClase = require('../middlewares/validarClase'); 
const verificarToken = require('../middlewares/verificarToken');
const horarioController = require('../controllers/horarioController');

router.post('/crear',verificarToken, validarClase, claseController.crearClase);

router.get('/obtener',verificarToken, claseController.obtenerClasesPorDocente);
router.get('/:codClase/obtener-horarios', verificarToken, claseController.obtenerHorarioDisponible);

router.post('/:codClase/horarios', verificarToken, horarioController.registrarHorario);

// Ruta para editar el número de integrantes
router.put('/:codClase/integrantes',verificarToken, claseController.editarNroIntegrantes);
  
module.exports = router;
