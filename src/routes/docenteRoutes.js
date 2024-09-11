const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const docenteController = require('../controllers/docenteController');

// Ruta para registrar un docente con validaciones
router.post('/registro', [
  // Validaciones
  check('nombre').not().isEmpty().withMessage('El nombre es obligatorio').isAlpha().withMessage('El nombre debe contener solo letras'),
  check('apellido').not().isEmpty().withMessage('El apellido es obligatorio').isAlpha().withMessage('El apellido debe contener solo letras'),
  check('correo')
    .isEmail().withMessage('Debe ser un correo válido')
    .matches(/@umss\.edu\.bo$/).withMessage('El correo debe ser un correo institucional válido (@umss.edu.bo)'), // Nueva validación
  check('contraseña').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
], (req, res) => {
  // Manejo de errores de validación
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  
  // Si no hay errores, pasamos al controlador
  docenteController.registrarDocente(req, res);
});


router.get('/', docenteController.obtenerDocentes);

module.exports = router;
