const captchaService = require('../services/captchaService');

exports.verifyCaptcha = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'No token provided' });
  }

  try {
    const verificationResult = await captchaService.verifyCaptcha(token);

    if (verificationResult.success && verificationResult.score > 0.5) {
      return res.status(200).json({ success: true, message: 'Captcha verificado con éxito' });
    } else {
      return res.status(400).json({ success: false, message: 'Falló la verificación del captcha' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error en la verificación del captcha', error: error.message });
  }
};
