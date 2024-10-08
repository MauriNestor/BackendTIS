const express = require("express");
const router = express.Router();
const registroGrupoController = require("../controllers/registroGrupoController");

// Ruta para registrar un grupo con el logotipo en base64
router.post("/registrarGrupo", registroGrupoController.registrarGrupo);
router.get("/", registroGrupoController.getAllGruposEmpresa);
router.get("/:codigoClase/estudiantes-sin-grupo", registroGrupoController.getEstudiantesSinGruposEmpresa);
module.exports = router;
