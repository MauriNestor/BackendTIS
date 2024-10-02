const { pool } = require('../config/db');

exports.obtenerGestiones = async (req, res) => {
  try {
    const result = await pool.query('SELECT cod_gestion, gestion FROM GESTION');
    
    res.status(200).json({ gestiones: result.rows });
  } catch (error) {
    console.error('Error al obtener las gestiones:', error);
    res.status(500).json({ error: 'Error al obtener las gestiones' });
  }
};
