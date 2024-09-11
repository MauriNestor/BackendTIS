const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');

// Ruta para registrar un estudiante con validaciones
router.post('/registro', [
  // Validaciones
  check('codigo_sis').isNumeric().withMessage('El código SIS debe ser numérico')
    .isLength({ min: 7, max: 8 }).withMessage('El código SIS debe tener entre 7 y 8 dígitos'),
  check('nombres').not().isEmpty().withMessage('Los nombres son obligatorios').isAlpha('es-ES', {ignore: ' '}).withMessage('Los nombres solo deben contener letras'),
  check('apellidos').not().isEmpty().withMessage('Los apellidos son obligatorios').isAlpha('es-ES', {ignore: ' '}).withMessage('Los apellidos solo deben contener letras'),
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
  estudianteController.registrarEstudiante(req, res);
});

router.get('/', estudianteController.obtenerEstudiantes);

module.exports = router;
