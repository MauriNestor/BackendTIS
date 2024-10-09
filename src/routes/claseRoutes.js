const express = require('express');
const router = express.Router();
const claseController = require('../controllers/claseController');
const validarClase = require('../middlewares/validarClase'); 
const verificarToken = require('../middlewares/verificarToken');

router.post('/crear',verificarToken, validarClase, claseController.crearClase);

router.get('/obtener',verificarToken, claseController.obtenerClasesPorDocente);
router.get('/:codClase/obtener-horarios', claseController.obtenerHorarioDisponible);
module.exports = router;
