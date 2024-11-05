
const express = require('express'); // Asegúrate de importar correctamente express
const router = express.Router();
const verificarToken = require("../middlewares/verificarToken");
const { calificarEstudianteController } = require('../controllers/calificacionController');
const { retroalimentarController } = require('../controllers/calificacionController');

// Ruta para calificar estudiante
router.post('/calificar', verificarToken, calificarEstudianteController);
// Ruta para guradar la retroalimentacion grupal
router.post('/retroalimentacion', verificarToken, retroalimentarController);

module.exports = router;
