const express = require('express');
const router = express.Router();
const evaluacionesController = require('../controllers/evaluacionController');
const verificarToken = require('../middlewares/verificarToken'); // Asegúrate de importar el middleware
const EvaluacionController = require('../controllers/evaluacionController');


router.get('/:cod_clase', verificarToken,evaluacionesController.getEvaluacionesByClass);

router.get('/detalles/:cod_evaluacion',verificarToken, evaluacionesController.getEvaluacionById);

router.get('/:codEvaluacion/entregas',verificarToken ,EvaluacionController.obtenerEstadoEntregas);

module.exports = router;