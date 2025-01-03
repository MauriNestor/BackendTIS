const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciaController');
const verificarToken = require('../middlewares/verificarToken');

router.post('/registrar/:codClase', verificarToken, asistenciaController.registrarAsistencia);

router.get('/reporte/:codClase/:codGrupo', verificarToken, asistenciaController.generarReporte);

router.get('/', verificarToken, asistenciaController.obtenerAsistencia);

module.exports = router;
