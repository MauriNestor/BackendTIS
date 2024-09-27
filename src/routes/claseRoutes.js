const express = require('express');
const router = express.Router();
const claseController = require('../controllers/claseController');
const validarClase = require('../middlewares/validarClase'); 
const verificarDocente = require('../middlewares/authMiddleware'); 

router.post('/crear', verificarDocente, validarClase, claseController.crearClase);

module.exports = router;
