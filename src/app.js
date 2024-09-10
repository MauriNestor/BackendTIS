const express = require('express');
const app = express();

// Middlewares
app.use(express.json());  // Para que Express pueda parsear JSON

// Importar las rutas
const docenteRoutes = require('./routes/docenteRoutes');
const estudianteRoutes = require('./routes/estudianteRoutes');

// Rutas
app.use('/docentes', docenteRoutes);
app.use('/estudiantes', estudianteRoutes);

module.exports = app;
