const express = require('express');
const router = express.Router();
const docenteController = require('../controllers/docenteController');
const docenteSchema = require('../schemas/docenteSchema');

// Middleware para validar con Zod
const validarDocente = (req, res, next) => {
  try {
    // Validar el esquema
    docenteSchema.parse(req.body);
    next(); // Si es válido, sigue al controlador
  } catch (error) {
    // Si la validación falla, retorna los errores
    return res.status(400).json({ errores: error.errors });
  }
};

// Ruta para registrar un docente con validación de Zod
router.post('/registro', validarDocente, docenteController.registrarDocente);


router.get('/', docenteController.obtenerDocentes);

module.exports = router;
