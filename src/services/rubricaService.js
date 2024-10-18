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

const registrarRubrica = async (codEvaluacion, nombrerubrica, descripcionRubrica, pesoRubrica, detallesRubrica) => {
    try {
        const result = await pool.query(
            `INSERT INTO Evaluacion (cod_evaluacion, nombre_rubrica, descripcion_rubrica, peso) 
            VALUES ($1, $2, $3, $4) RETURNING *;`,
            [codEvaluacion, nombrerubrica, descripcionRubrica, pesoRubrica]
        );
        codRubrica = result.rows[0].cod_rubrica;
        // Verifica si se enviaron `detallesRubrica`
        if (detallesRubrica && detallesRubrica.length > 0) {
            
        } else {
            return codRubrica;
        }
    }  catch (err) {
        console.error('Error al registrar tema', err);
        throw err;
    }
};

module.exports = {
  getRubricasByEvaluacion,
  registrarRubrica,
};
