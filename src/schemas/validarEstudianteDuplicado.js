const { pool } = require('../config/db');

const validarEstudianteDuplicado = async (req, res, next) => {
  const { codigo_sis } = req.body;

  try {
    const result = await pool.query('SELECT * FROM estudiante WHERE CODIGO_SIS = $1', [codigo_sis]);
    
    if (result.rows.length > 0) {
      return res.status(400).json({
        error: 'El estudiante con este CODIGO_SIS ya está registrado'
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
