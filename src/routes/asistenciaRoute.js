const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciaController');
const verificarToken = require('../middlewares/verificarToken');

router.post('/registrar/:codClase', verificarToken, asistenciaController.registrarAsistencia);

router.get('/reporte/:codClase', verificarToken, asistenciaController.generarReporte);

module.exports = router;
