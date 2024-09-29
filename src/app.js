const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const docenteRoutes = require("./routes/docenteRoutes");
const estudianteRoutes = require("./routes/estudianteRoutes");
const pruebaRoutes = require("./routes/healthy");
const loginRoutes = require("./routes/loginRoute");
const registroGrupoRoutes = require("./routes/registroGrupoRoutes"); // Importamos las rutas de registro de grupo
const db = require("./config/db");

// Cargar las variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json()); // Para parsear JSON

// Hacer pública la carpeta 'uploads/logos' para que se pueda acceder a los logotipos
app.use("/uploads/logos", express.static("uploads/logos")); // Esto permitirá acceder a las imágenes subidas desde el navegador

// Rutas
app.use("/", pruebaRoutes);
app.use("/docentes", docenteRoutes);
app.use("/estudiantes", estudianteRoutes);
app.use("/login", loginRoutes);
app.use("/api/grupos", registroGrupoRoutes); // Añadir la nueva ruta para registrar grupos

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

module.exports = app;
