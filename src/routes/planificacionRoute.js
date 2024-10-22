const express = require('express');
const router = express.Router();
const planificacionController = require('../controllers/planificacionController');
const verificarToken = require('../middlewares/verificarToken');

// Ruta para registrar la planificación (product backlog)
router.post('/productbacklog', verificarToken, planificacionController.registrarPlanificacion);

// Ruta para registrar los requerimientos
router.post('/requerimientos',verificarToken, planificacionController.registrarRequerimientos);

// Ruta para registrar el sprint
router.post('/registrar-sprint', verificarToken, planificacionController.registrarSprint);
// Ruta para registrar una liusta de requerimientos a un sprint
router.put('/requerimientos/registrar-sprint', verificarToken, planificacionController.registrarRequerimientoASprint);

// Ruta para obtener los sprints y sus requerimientos correspondientes
router.get('/sprints/:codigoGrupo',verificarToken, planificacionController.obtenerSprint);

// Ruta para obtener el product backlog de un grupo específico
router.get('/productbacklog/sin-sprint/:codigoGrupo', verificarToken, planificacionController.obtenerProductBacklog);

// Ruta para obtener el product backlog de un grupo específico
router.get('/productbacklog/:codigoGrupo', verificarToken, planificacionController.obtenerTodoProductBacklog);

module.exports = router;
