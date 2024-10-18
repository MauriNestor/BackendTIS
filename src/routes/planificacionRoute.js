const express = require('express');
const router = express.Router();
const planificacionController = require('../controllers/planificacionController');

// Ruta para registrar la planificación (product backlog)
router.post('/productbacklog', planificacionController.registrarPlanificacion);

// Ruta para registrar los requerimientos
router.post('/requerimientos', planificacionController.registrarRequerimientos);

// Ruta para registrar el sprint
router.post('/registrar-sprint', planificacionController.registrarSprint);

// Ruta para obtener los sprints y sus requerimientos correspondientes
router.get('/sprints/:codigoGrupo', planificacionController.obtenerSprint);

// Ruta para obtener el product backlog de un grupo específico
router.get('/productbacklog/:codigoGrupo', planificacionController.obtenerProductBacklog);

module.exports = router;
