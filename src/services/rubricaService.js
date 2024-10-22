const { pool } = require('../config/db');
const detalleRubricaService = require('../services/detalleRubricaService');

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

const registrarRubrica = async (codEvaluacion, rubricas) => {
    const client = await pool.connect(); 
    try {
        await client.query('BEGIN'); 
        let codRubrica;
        for (const rubrica of rubricas) { 
          const result = await client.query(
            `INSERT INTO Rubrica (cod_evaluacion, nombre_rubrica, descripcion_rubrica, peso) 
            VALUES ($1, $2, $3, $4) RETURNING *;`,
            [codEvaluacion, rubrica.nombreRubrica, rubrica.descripcionRubrica, rubrica.pesoRubrica]
        );
        codRubrica = result.rows[0].cod_rubrica;

        // Verifica si se enviaron `detallesRubrica`
        let codigosDetalle;
        if (rubrica.detallesRubrica && rubrica.detallesRubrica.length > 0) {
            codigosDetalle = await detalleRubricaService.registrarDetallesRubrica(client, codEvaluacion, codRubrica, rubrica.detallesRubrica);
        }
      }
        
      await client.query('COMMIT');
      //return {codRubrica, codigosDetalle};

    } catch (err) {
        await client.query('ROLLBACK'); // Revertir la transacción en caso de error
        console.error('Error al registrar rúbrica', err);
        throw err; 
    } finally {
        client.release(); 
    }
};


module.exports = {
  getRubricasByEvaluacion,
  registrarRubrica,
};
