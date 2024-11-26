const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const  verificarToken = require('../middlewares/verificarToken');

router.get('/grupos/:codigoGrupo/reporte-notas', verificarToken, reporteController.generarReporteNotasPorGrupo);

module.exports = router;
