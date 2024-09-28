const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const docenteRoutes = require('./routes/docenteRoutes');
const estudianteRoutes = require('./routes/estudianteRoutes');
const pruebaRoutes = require('./routes/healthy');
const loginRoutes = require('./routes/loginRoute'); 
const planificacionRoutes = require('./routes/planificacionRoute'); 
const db = require('./config/db');

// Cargar las variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Middlewares
app.use(cors());  // Habilitar CORS si es necesario
app.use(express.json());  // Para parsear JSON

// Rutas
app.use('/', pruebaRoutes);     
app.use('/docentes', docenteRoutes);     
app.use('/estudiantes', estudianteRoutes);     
app.use('/login', loginRoutes);     
app.use('/planificacion', planificacionRoutes); 


app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;
