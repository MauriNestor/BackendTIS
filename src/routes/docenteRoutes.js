const express = require('express');
const router = express.Router();
const docenteController = require('../controllers/docenteController');
const validarDocente = require('../middlewares/validarDocente');
const validarCorreoDocenteDuplicado = require('../middlewares/validarCorreoDocenteDuplicado');  // Verificar duplicidad del correo



router.post('/registro', validarDocente, validarCorreoDocenteDuplicado, docenteController.registrarDocente);
router.get('/', docenteController.obtenerDocentes);

module.exports = router;
