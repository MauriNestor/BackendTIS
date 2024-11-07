const { pool } = require('../config/db');
const detalleRubricaService = require('../services/detalleRubricaService');
const grupoEstudianteService = require('../services/grupoEstudianteService');



const verificarGrupoAsociadoAEvaluacion = async (cod_evaluacion, cod_grupoempresa) => {
    const result = await pool.query(
        `SELECT ge.cod_grupoempresa
         FROM grupo_empresa ge
         INNER JOIN clase c ON ge.cod_clase = c.cod_clase
         INNER JOIN evaluacion e ON e.cod_clase = c.cod_clase
         WHERE e.cod_evaluacion = $1 AND ge.cod_grupoempresa = $2`,
        [cod_evaluacion, cod_grupoempresa]
    );

    if (result.rows.length === 0) {
        throw new Error('No se encontró el grupo de empresa asociado a la evaluación');
    }
};

const obtenerRubricasPorEvaluacion = async (cod_evaluacion) => {
    const result = await pool.query(
        `SELECT r.cod_rubrica, r.nombre_rubrica, r.descripcion_rubrica, r.peso
         FROM rubrica r
         WHERE r.cod_evaluacion = $1`,
        [cod_evaluacion]
    );

    if (result.rows.length === 0) {
        throw new Error('No se encontraron rúbricas para la evaluación');
    }
    return result.rows;
};

const obtenerDetallesPorRubrica = async (cod_rubrica) => {
    const result = await pool.query(
        `SELECT d.cod_detalle, d.peso_rubrica, d.descripcion, d.clasificacion_rubrica
         FROM detalle_rubrica d
         WHERE d.cod_rubrica = $1`,
        [cod_rubrica]
    );

    return result.rows;
};
const obtenerCalificacionPorEstudianteYRubrica = async (cod_rubrica, cod_evaluacion, codigo_sis) => {
    const result = await pool.query(
        `SELECT cr.calificacion
         FROM calificacion_rubrica cr
         WHERE cr.cod_rubrica = $1 AND cr.cod_evaluacion = $2 AND cr.codigo_sis = $3`,
        [cod_rubrica, cod_evaluacion, codigo_sis]
    );

    return result.rows.length > 0 ? result.rows[0] : { calificacion: null, observacion: null };
};
const obtenerEstudiantesConCalificaciones = async (estudiantes, rubrica, cod_evaluacion) => {
    return Promise.all(
        estudiantes.map(async (estudiante) => {
            const calificacion = await obtenerCalificacionPorEstudianteYRubrica(
                rubrica.cod_rubrica,
                cod_evaluacion,
                estudiante.codigo_sis
            );
            return { ...estudiante, calificacion };
        })
    );
};

const obtenerRubricasConCalificaciones = async (cod_evaluacion, cod_grupoempresa) => {
    try {
        await verificarGrupoAsociadoAEvaluacion(cod_evaluacion, cod_grupoempresa);

        const rubricas = await obtenerRubricasPorEvaluacion(cod_evaluacion);
        const estudiantes = await grupoEstudianteService.getEstudiantes(cod_grupoempresa);

        const rubricasConCalificaciones = await Promise.all(
            rubricas.map(async (rubrica) => {
                const detalles = await obtenerDetallesPorRubrica(rubrica.cod_rubrica);
                const estudiantesConCalificacion = await obtenerEstudiantesConCalificaciones(
                    estudiantes,
                    rubrica,
                    cod_evaluacion
                );

                return {
                    ...rubrica,
                    detalles,
                    estudiantes: estudiantesConCalificacion
                };
            })
        );

        return rubricasConCalificaciones;
    } catch (error) {
        console.error('Error al obtener rúbricas con calificaciones', error);
        throw new Error('Error al obtener rúbricas con calificaciones');
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
  obtenerRubricasConCalificaciones,
  obtenerRubricasPorEvaluacion,
  obtenerDetallesPorRubrica
};
