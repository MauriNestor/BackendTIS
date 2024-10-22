const express = require('express');
const router = express.Router();
const temaController = require('../controllers/temaController');
const verificarToken = require("../middlewares/verificarToken");

router.get('/:codigoClase', verificarToken, temaController.getTema);

module.exports = router;
