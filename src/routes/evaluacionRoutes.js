const express = require('express');
const router = express.Router();
const evaluacionesController = require('../controllers/evaluacionController');
const validarDocente = require('../middlewares/validarDocente');
const verificarToken = require('../middlewares/verificarToken'); // Asegúrate de importar el middleware


router.get('/:cod_clase', verificarToken,evaluacionesController.getEvaluacionesByClass);

router.get('/detalles/:cod_evaluacion',verificarToken, evaluacionesController.getEvaluacionById);

router.post('/registrar-evaluacion', verificarToken, evaluacionController.registrarEvaluacion);

module.exports = router;