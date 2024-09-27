const jwt = require('jsonwebtoken');

const verificarDocente = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No autorizado: se requiere un token' });
  }

  try {
    const decoded = jwt.verify(token, 'tu_clave_secreta'); // Asegúrate de que sea la misma clave

    if (decoded.role !== 'docente') {
      return res.status(403).json({ error: 'Acceso denegado: solo los docentes pueden crear clases' });
    }

    req.docenteId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token no válido' });
  }
};

module.exports = verificarDocente;
