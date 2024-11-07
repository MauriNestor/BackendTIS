const express = require('express');
const router = express.Router();
const evaluacionCruzadaController = require('../controllers/evaluacionCruzadaController');
const verificarToken = require('../middlewares/verificarToken');


router.get('/:codClase', verificarToken, evaluacionCruzadaController.getGrupoAEvaluar);


module.exports = router;
