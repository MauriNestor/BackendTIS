const { pool } = require('../config/db');

const getRubricasByEvaluacion = async (codEvaluacion) => {
    const query = `
      SELECT r.cod_rubrica, r.nombre_rubrica, r.descripcion_rubrica, r.peso,
             dr.cod_detalle, dr.descripcion AS descripcion_detalle, dr.peso_rubrica, dr.clasificacion_rubrica
      FROM rubrica r
      INNER JOIN detalle_rubrica dr ON r.cod_rubrica = dr.cod_rubrica
      WHERE r.cod_evaluacion = $1
    `;
    try {
      const { rows } = await pool.query(query, [codEvaluacion]);
      return rows;
    } catch (error) {
      console.error('Error al obtener rúbricas:', error);
      throw new Error('Error al obtener las rúbricas de la evaluación.');
    }
};
module.exports = {
  getRubricasByEvaluacion,
};
