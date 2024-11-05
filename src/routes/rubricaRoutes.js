const express = require("express");
const router = express.Router();
const rubricaController = require("../controllers/rubricaController");
const verificarToken = require("../middlewares/verificarToken");


router.post('/registrar-rubrica', verificarToken, rubricaController.registrarRubrica);

router.get('/:codEvaluacion/grupos/:codGrupo/calificaciones', verificarToken, rubricaController.obtenerCalificacionesPorEvaluacionYGrupo);

module.exports = router;