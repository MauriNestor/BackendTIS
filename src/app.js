const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const docenteRoutes = require('./routes/docenteRoutes');
const estudianteRoutes = require('./routes/estudianteRoutes');
const db = require('./config/db');

// Cargar las variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Middlewares
app.use(cors());  // Habilitar CORS si es necesario
app.use(express.json());  // Para parsear JSON

// Rutas
app.use('/docentes', docenteRoutes);     // Rutas de docentes
app.use('/estudiantes', estudianteRoutes);  // Rutas de estudiantes

// Ruta de salud (opcional)
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;

