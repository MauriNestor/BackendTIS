const express = require("express");
const router = express.Router();
const rubricaController = require("../controllers/rubricaController");
const verificarToken = require("../middlewares/verificarToken");

router.get('/:codEvaluacion', verificarToken, rubricaController.getRubricasDeEvaluacion);

module.exports = router;