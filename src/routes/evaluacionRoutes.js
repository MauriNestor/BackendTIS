const express = require('express');
const router = express.Router();
const evaluacionesController = require('../controllers/evaluacionController');
const verificarToken = require('../middlewares/verificarToken'); 
const EvaluacionController = require('../controllers/evaluacionController');
const verificarEstudiante = require('../middlewares/verificarEstudiante');


router.get('/:cod_clase', verificarToken,evaluacionesController.getEvaluacionesByClass);

router.get('/detalles/:cod_evaluacion',verificarToken, evaluacionesController.getEvaluacionById);


router.post('/registrar-evaluacion', verificarToken, evaluacionesController.registrarEvaluacion);

router.get('/:codEvaluacion/entregas',verificarToken ,EvaluacionController.obtenerEstadoEntregas);

router.post('/:codGrupo/entregables', verificarToken, verificarEstudiante, EvaluacionController.subirEntregable);

module.exports = router;