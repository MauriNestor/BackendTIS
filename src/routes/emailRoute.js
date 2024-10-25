const express = require('express');
const router = express.Router();
const { enviarCorreoRestablecer } = require('../controllers/emailController');

// Ruta POST para enviar el correo de restablecimiento
router.post('/enviar-correo-restablecer', enviarCorreoRestablecer);

module.exports = router;
