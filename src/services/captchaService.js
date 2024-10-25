const axios = require('axios');

exports.verifyCaptcha = async (token) => {
  const secretKey = '6LeFdWsqAAAAADuaUlGwF1N1toZ0LSv-7o1Y6cOR'; // Clave secreta de reCAPTCHA

  try {
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: secretKey,
        response: token
      }
    });

    return response.data;
  } catch (error) {
    throw new Error('Error al verificar el captcha');
  }
};
