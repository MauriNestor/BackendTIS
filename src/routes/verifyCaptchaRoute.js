const express = require('express');
const router = express.Router();
const captchaController = require('../controllers/verifyCaptchaController');

// Definir la ruta para verificar el captcha
router.post('/verify-captcha', captchaController.verifyCaptcha);

module.exports = router;
