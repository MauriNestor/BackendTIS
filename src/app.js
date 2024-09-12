const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pruebaRoutes = require('./routes/healthy');
const db = require('./config/db');

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());  // Para que Express pueda parsear JSON

// Importar las rutas
const docenteRoutes = require('./routes/docenteRoutes');
const estudianteRoutes = require('./routes/estudianteRoutes');

// Rutas
app.use('/prueba', pruebaRoutes);

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).send('404: Ruta no encontrada');
});

// Conexión a la base de datos
db.pool.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});

module.exports = app;
