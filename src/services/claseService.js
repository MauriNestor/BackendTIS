const { pool } = require('../config/db');

const getGestion = async (codGestion) => {
  try {
      const result = await pool.query(
          'SELECT gestion FROM Gestion WHERE cod_gestion = $1',
          [codGestion]
      );
      return result.rows[0]?.gestion || null; // Devolver el valor de gestion o null si no existe
  } catch (err) {
      console.error('Error al buscar la gestion', err);
      throw err;
  }
};

const ClaseService = {
crearClase: async (codDocente, codClase, codGestion, nombreClase) => {
  try {
    const result = await pool.query(
      'INSERT INTO CLASE (cod_docente, cod_clase, cod_gestion, nombre_clase, nro_integrantes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [codDocente, codClase, codGestion, nombreClase, 6]
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

    const modifiedRows = await Promise.all(result.rows.map(async (row) => {
      const gestion = await getGestion(row.cod_gestion); 
      return {
        ...row,
        gestion 
      };
    }));

    return modifiedRows;
  } catch (error) {
    console.error('Error en la consulta de obtención de clases por docente:', error);
    throw new Error('Error al obtener las clases del docente en la base de datos');
  }
}, 

obtenerHorarioDisponible: async (codClase) => {
  try {
    const result = await pool.query(
      `SELECT h.cod_horario, h.dia_horario, h.hora_inicio, h.hora_fin 
        FROM Horario as h
        WHERE h.cod_clase = $1 AND h.cod_horario 
        NOT IN (SELECT gr.cod_horario
        FROM grupo_empresa as gr)`,
      [codClase]
    );
    return result.rows;
  } catch (error) {
    console.error('Error en la consulta de obtención de horarios de clase:', error);
    throw new Error('Error al obtener horarios de clase en la base de datos');
  }
},

getNombreClase: async (codClase) => {
  try {
    const result = await pool.query(
      `SELECT nombre_clase 
        FROM Clase
        WHERE cod_clase = $1 `,
      [codClase]
    );
    return result.rows[0].nombre_clase;
  } catch (error) {
    console.error('Error en la consulta de getNombreClase:', error);
    throw new Error('Error getNombreClase');
  }
},

editarNroIntegrantes: async (codClase, nroIntegrantes) => {
  try {
    const result = await pool.query(
      `UPDATE clase
      SET nro_integrantes = $1
      WHERE cod_clase = $2 ;`,
      [nroIntegrantes, codClase]
    );
    
  } catch (error) {
    console.error('Error en la consulta de editarNroIntegrantes:', error);
    throw new Error('Error editarNroIntegrantes');
  }
}

};

module.exports = ClaseService;
