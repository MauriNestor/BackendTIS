const express = require("express");
const router = express.Router();
const registroGrupoController = require("../controllers/registroGrupoController");

// Importar multer para manejar la subida de archivos
const multer = require("multer");
const path = require("path");
// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/logos");
    console.log("Saving to: ", dir); // Añadir esta línea
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Cambia el nombre del archivo si es necesario
  },
});

const upload = multer({ storage: storage });

// Ruta para registrar un grupo con el logotipo
router.post(
  "/registrarGrupo",
  upload.single("logo"),
  registroGrupoController.registrarGrupo
);

module.exports = router;
