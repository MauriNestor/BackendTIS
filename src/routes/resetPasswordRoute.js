const express = require('express');
const router = express.Router();
const resetPasswordController = require('../controllers/resetPasswordController');
const validarPassword = require('../middlewares/validarPassword');

// Ruta para restablecer contraseña
router.post('/reset-password',  validarPassword, resetPasswordController.resetPassword);

module.exports = router;
