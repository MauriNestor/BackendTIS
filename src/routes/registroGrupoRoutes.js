const express = require("express");
const router = express.Router();
const registroGrupoController = require("../controllers/registroGrupoController");
const verificarToken = require("../middlewares/verificarToken");
const verificarGrupoEstudiante = require('../middlewares/verificarGrupoEstudiante');

// Ruta para registrar un grupo con el logotipo en base64
router.post("/registrarGrupo", verificarToken, registroGrupoController.registrarGrupo);
router.get("/:codigoClase", verificarToken, registroGrupoController.getAllGruposEmpresa);
router.get("/:codigoClase/estudiantes-sin-grupo", verificarToken, registroGrupoController.getEstudiantesSinGruposEmpresa);
router.get("/grupo/:codigoGrupo",verificarToken, verificarGrupoEstudiante, registroGrupoController.getGrupoEmpresa);

router.put("/:codigoClase/grupo/:codigoGrupo/agregarIntegrantes", verificarToken, registroGrupoController.agregarIntegrantes);

module.exports = router;
