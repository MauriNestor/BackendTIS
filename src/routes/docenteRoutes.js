const express = require('express');
const router = express.Router();
const docenteController = require('../controllers/docenteController');
const validarDocente = require('../middlewares/validarDocente');



router.post('/registro', validarDocente, docenteController.registrarDocente);
router.get('/', docenteController.obtenerDocentes);

module.exports = router;
