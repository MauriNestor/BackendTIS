const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const docenteRoutes = require("./routes/docenteRoutes");
const estudianteRoutes = require("./routes/estudianteRoutes");
const pruebaRoutes = require("./routes/healthy");
const loginRoutes = require("./routes/loginRoute");
const planificacionRoutes = require("./routes/planificacionRoute");
const claseRoutes = require("./routes/claseRoutes");
const emailRoutes = require("./routes/emailRoute");
const resetPasswordRoutes = require("./routes/resetPasswordRoute");
const claseEstudianteRoutes = require("./routes/claseEstudianteRoute");
const gestionRoutes = require("./routes/gestionRoutes");
const registroGrupoRoutes = require("./routes/registroGrupoRoutes");
const evaluacionRoutes = require('./routes/evaluacionRoutes');
const temaRoutes = require('./routes/temaRoute');
const rubricaRoutes = require('./routes/rubricaRoutes');
const evaluacionCruzadaRoutes = require('./routes/evaluacionCruzadaRoute');
const calificacionRoutes = require('./routes/calificacionRoute');


const db = require("./config/db");

// Cargar las variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Middlewares

app.use(
  cors({
    origin: ["https://mtis.netlify.app", "http://localhost:5174", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(express.json({ limit: "10mb" })); // Para parsear JSON con límite
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Para parsear JSON

// Rutas
app.use("/", pruebaRoutes);
app.use("/docentes", docenteRoutes);
app.use("/estudiantes", estudianteRoutes);
app.use("/login", loginRoutes);
app.use("/planificacion", planificacionRoutes);
app.use("/clases", claseRoutes);
app.use("/email", emailRoutes);
app.use("/password", resetPasswordRoutes);
app.use("/clases-estudiante", claseEstudianteRoutes);
app.use("/api/grupos", registroGrupoRoutes);
app.use("/gestiones", gestionRoutes);
app.use('/evaluaciones', evaluacionRoutes);
app.use('/temas', temaRoutes);
app.use('/rubricas', rubricaRoutes);
app.use('/eval-cruzada', evaluacionCruzadaRoutes);
app.use('/evaluacion', calificacionRoutes);


// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

module.exports = app;
