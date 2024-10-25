const verificarEstudiante = (req, res, next) => {
    if (req.user && req.user.role === 'estudiante') {
      return next();
    } else {
      return res.status(403).json({ error: 'Acceso denegado. Solo los estudiantes pueden realizar esta acción.' });
    }
  };
  
  module.exports = verificarEstudiante;
  