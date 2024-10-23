const express = require("express");
const router = express.Router();
const rubricaController = require("../controllers/rubricaController");
const verificarToken = require("../middlewares/verificarToken");

// router.get('/:codEvaluacion', verificarToken, rubricaController.getRubricasDeEvaluacion);
router.get('/:codEvaluacion/grupos/:codGrupo/rubricas', verificarToken, rubricaController.obtenerRubricasConDetalles);

router.post('/registrar-rubrica', verificarToken, rubricaController.registrarRubrica);

module.exports = router;