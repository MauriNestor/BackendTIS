const { pool } = require('../config/db');

const ClaseService = {
  crearClase: async (codDocente, codClase, codGestion, nombreClase) => {
    try {
      const result = await pool.query(
        'INSERT INTO CLASE (cod_docente, cod_clase, cod_gestion, nombre_clase) VALUES ($1, $2, $3, $4) RETURNING *',
        [codDocente, codClase, codGestion, nombreClase]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error en la consulta de creación de clase:', error);
      throw new Error('Error al crear la clase en la base de datos');
    }
  },
  obtenerClasesPorDocente: async (codDocente) => {
    try {
      const result = await pool.query(
        'SELECT cod_clase, nombre_clase, cod_gestion FROM clase WHERE cod_docente = $1',
        [codDocente]
      );
      return result.rows;
    } catch (error) {
      console.error('Error en la consulta de obtención de clases por docente:', error);
      throw new Error('Error al obtener las clases del docente en la base de datos');
    }
  }
};


module.exports = ClaseService;
