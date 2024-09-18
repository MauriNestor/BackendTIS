const { pool } = require('../config/db');

const validarEstudianteDuplicado = async (req, res, next) => {
  const { codigo_sis, correo } = req.body; 

  try {
    const sisResult = await pool.query('SELECT * FROM estudiante WHERE CODIGO_SIS = $1', [codigo_sis]);
    
    if (sisResult.rows.length > 0) {
      return res.status(400).json({
        error: 'Estudiante duplicado',
        detalle: 'El estudiante con este CODIGO_SIS ya está registrado'
      });
    }

    const correoResult = await pool.query('SELECT * FROM estudiante WHERE CORREO_ESTUDIANTE = $1', [correo]);

    if (correoResult.rows.length > 0) {
      return res.status(400).json({
        error: 'Correo duplicado',
        detalle: 'El correo ya está registrado'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      error: 'Error al validar estudiante',
      detalle: error.message
    });
  }
};

module.exports = validarEstudianteDuplicado;
