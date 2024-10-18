const express = require("express");
const router = express.Router();
const registroGrupoController = require("../controllers/registroGrupoController");
const verificarToken = require("../middlewares/verificarToken");

// Ruta para registrar un grupo con el logotipo en base64
router.post("/registrarGrupo", registroGrupoController.registrarGrupo);
router.get("/:codigoClase", registroGrupoController.getAllGruposEmpresa);
router.get("/:codigoClase/estudiantes-sin-grupo", registroGrupoController.getEstudiantesSinGruposEmpresa);
router.get("/grupo/:codigoGrupo", registroGrupoController.getGrupoEmpresa);

// Ruta para obtener los estudiantes de un grupo
router.get('/:codGrupo/estudiantes', verificarToken, registroGrupoController.getEstudiantesDeGrupo);

// Ruta para obtener las rúbricas de una evaluación
router.get('/evaluaciones/:codEvaluacion/rubricas', verificarToken, registroGrupoController.getRubricasDeEvaluacion);

module.exports = router;
