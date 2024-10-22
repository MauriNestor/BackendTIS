const { pool } = require('../config/db');
const detalleRubricaService = require('../services/detalleRubricaService');

const obtenerRubricasConDetalles = async (cod_evaluacion, cod_grupoempresa) => {
    try {
        const grupoResult = await pool.query(
          `SELECT ge.cod_grupoempresa
             FROM grupo_empresa ge
             INNER JOIN clase c ON ge.cod_clase = c.cod_clase
             INNER JOIN evaluacion e ON e.cod_clase = c.cod_clase
             WHERE e.cod_evaluacion = $1 AND ge.cod_grupoempresa = $2`,
            [cod_evaluacion, cod_grupoempresa]
        );
        if (grupoResult.rows.length === 0) {
            throw new Error('No se encontró el grupo de empresa');
        }
        const rubricasResult = await pool.query(
            `SELECT r.cod_rubrica, r.nombre_rubrica, r.descripcion_rubrica, r.peso
             FROM rubrica r
             WHERE r.cod_evaluacion = $1`,
            [cod_evaluacion]
        );
        if (rubricasResult.rows.length === 0) {
            throw new Error('No se encontraron rúbricas para la evaluación');
        }
        const rubricasConDetalles = await Promise.all(
          rubricasResult.rows.map(async (rubrica) => {
              const detallesResult = await pool.query(
                  `SELECT d.cod_detalle, d.peso_rubrica, d.descripcion, d.clasificacion_rubrica
                   FROM detalle_rubrica d
                   WHERE d.cod_rubrica = $1`,
                  [rubrica.cod_rubrica]
              );

              return {
                  ...rubrica,
                  detalles: detallesResult.rows
              };
          })
      );
      return rubricasConDetalles;
      }catch(error){ 
        console.error('Error al obtener rúbricas con detalles', error);
        throw new Error('Error al obtener rúbricas con detalles');
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
  registrarRubrica,
  obtenerRubricasConDetalles
};
