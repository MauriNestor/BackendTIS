const express = require('express');
const router = express.Router();
const planificacionController = require('../controllers/planificacionController');

// Ruta para registrar la planificación (product backlog)
router.post('/planificacion', planificacionController.registrarPlanificacion);

// Ruta para registrar los requerimientos
router.post('/requerimientos', planificacionController.registrarRequerimientos);

// Ruta para registrar el sprint
router.post('/sprint', planificacionController.registrarSprint);

module.exports = router;
