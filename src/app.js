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

// Aumentar el límite de tamaño de la carga a 10MB
app.use(express.json({ limit: "10mb" })); // Para parsear JSON con límite
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Para parsear URL-encoded con límite

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
