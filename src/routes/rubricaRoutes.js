const express = require("express");
const router = express.Router();
const rubricaController = require("../controllers/rubricaController");
const verificarToken = require("../middlewares/verificarToken");


router.post('/registrar-rubrica', verificarToken, rubricaController.registrarRubrica);

router.get('/:codEvaluacion/grupos/:codGrupo/calificaciones', verificarToken, rubricaController.obtenerCalificacionesPorEvaluacionYGrupo);

// Ruta para editar múltiples rúbricas
router.put('/editar', verificarToken, rubricaController.editarRubrica);

router.get('/:codEvaluacion', verificarToken, rubricaController.obtenerRubrica);

module.exports = router;