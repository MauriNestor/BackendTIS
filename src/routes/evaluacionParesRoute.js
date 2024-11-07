const express = require("express");
const router = express.Router();
const evaluacionParesController = require("../controllers/evaluacionParesController");
const verificarToken = require('../middlewares/verificarToken');

router.get('/:codClase', verificarToken, evaluacionParesController.estudiantesGrupo);

module.exports = router;
