const express = require('express');
const router = express.Router();
const claseController = require('../controllers/claseController');
const validarClase = require('../middlewares/validarClase'); 
const verificarToken = require('../middlewares/verificarToken');

router.post('/crear',verificarToken, validarClase, claseController.crearClase);

module.exports = router;
