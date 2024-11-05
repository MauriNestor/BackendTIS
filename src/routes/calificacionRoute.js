// routes/calificacionRoute.js
const express = require('express'); // Asegúrate de importar correctamente express
const router = express.Router();
const verificarToken = require("../middlewares/verificarToken");
const { calificarEstudianteController } = require('../controllers/calificacionController');

// Ruta para calificar estudiante
router.post('/calificar', verificarToken, calificarEstudianteController);

module.exports = router;
