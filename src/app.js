const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pruebaRoutes = require('./routes/healthy');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/prueba', pruebaRoutes);

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).send('404: Ruta no encontrada');
});

module.exports = app;
