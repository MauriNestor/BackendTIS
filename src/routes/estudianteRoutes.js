const express = require('express');
const estudianteSchema = require('../schemas/estudianteSchema');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');

// Middleware para validar con Zod
const validarEstudiante = (req, res, next) => {
  try {
    // Validar el esquema
    estudianteSchema.parse(req.body);
    next(); // Si es válido, sigue al controlador
  } catch (error) {
    // Si la validación falla, retorna los errores
    return res.status(400).json({ errores: error.errors });
  }
};

// Ruta para registrar un estudiante con validación de Zod
router.post('/registro', validarEstudiante, estudianteController.registrarEstudiante);


router.get('/', estudianteController.obtenerEstudiantes);

module.exports = router;
