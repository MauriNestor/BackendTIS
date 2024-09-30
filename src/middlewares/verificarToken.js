const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Obtener el token de la cabecera 'Authorization'

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token' });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Adjuntar la información del usuario decodificada al objeto 'req'
    req.user = decoded; 

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = verificarToken;
