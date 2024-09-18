const { pool } = require('../config/db');

const validarCorreoDocenteDuplicado = async (req, res, next) => {
  const { correo } = req.body;

  try {
    // Verificar si el correo ya está en la base de datos
    const result = await pool.query('SELECT * FROM docente WHERE correo = $1', [correo]);

    if (result.rows.length > 0) {
      return res.status(400).json({
        error: 'Correo duplicado',
        detalle: 'El correo ya está registrado en el sistema'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      error: 'Error al validar el correo',
      detalle: error.message
    });
  }
};

module.exports = validarCorreoDocenteDuplicado;
