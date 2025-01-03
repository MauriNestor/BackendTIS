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

const obtenerRubricasConCalificaciones = async (cod_evaluacion, cod_grupoempresa) => {
    try {
        await verificarGrupoAsociadoAEvaluacion(cod_evaluacion, cod_grupoempresa);

        const rubricas = await obtenerRubricasPorEvaluacion(cod_evaluacion);

        const estudiantes = await grupoEstudianteService.getEstudiantes(cod_grupoempresa);

        const retroalimentacionGrupalResult = await pool.query(
            `SELECT comentario, fecha_registro
             FROM retroalimentacion_grupal
             WHERE cod_evaluacion = $1 AND cod_grupoempresa = $2
             ORDER BY fecha_registro DESC`,
            [cod_evaluacion, cod_grupoempresa]
        );
        const retroalimentacionGrupal = retroalimentacionGrupalResult.rows || [];
        const rubricasConCalificaciones = await Promise.all(
            rubricas.map(async (rubrica) => {
                const detalles = await obtenerDetallesPorRubrica(rubrica.cod_rubrica);

                const estudiantesConCalificacion = await Promise.all(
                    estudiantes.map(async (estudiante) => {
                        const calificacionResult = await pool.query(
                            `SELECT cr.calificacion
                             FROM calificacion_rubrica cr
                             WHERE cr.cod_rubrica = $1 AND cr.cod_evaluacion = $2 AND cr.codigo_sis = $3`,
                            [rubrica.cod_rubrica, cod_evaluacion, estudiante.codigo_sis]
                        );

                        const calificacion = calificacionResult.rows.length > 0
                            ? calificacionResult.rows[0]
                            : { calificacion: null, observacion: null };

                        const retroalimentacionResult = await pool.query(
                            `SELECT comentario_individual
                             FROM retroalimentacion_individual
                             WHERE cod_evaluacion = $1 AND codigo_sis = $2`,
                            [cod_evaluacion, estudiante.codigo_sis]
                        );

                        const retroalimentacionIndividual = retroalimentacionResult.rows[0]?.comentario_individual || null;

                        return {
                            ...estudiante,
                            calificacion: calificacion.calificacion,
                            observacion: calificacion.observacion,
                            retroalimentacion_individual: retroalimentacionIndividual
                        };
                    })
                );

                return {
                    ...rubrica,
                    detalles,
                    estudiantes: estudiantesConCalificacion
                };
            })
        );

        return {
            rubricas: rubricasConCalificaciones,
            retroalimentacion_grupal: retroalimentacionGrupal
        };
    } catch (error) {
        console.error('Error al obtener rúbricas con calificaciones y retroalimentación:', error);
        throw new Error('Error al obtener rúbricas con calificaciones y retroalimentación');
    }
};

const registrarRubrica = async (codEvaluacion, rubricas) => {
    const client = await pool.connect(); 
    try {
        await client.query('BEGIN'); 
        let codRubrica;
        const codClaseResult = await client.query(
            `SELECT cod_clase FROM evaluacion WHERE cod_evaluacion = $1`,
            [codEvaluacion]
        );

        if (codClaseResult.rows.length === 0) {
            throw new Error(`No se encontró una clase para la evaluación con código ${codEvaluacion}`);
        }

        const codClase = codClaseResult.rows[0].cod_clase;
        for (const rubrica of rubricas) {
            const notaActual = await getNotaTotal(codClase);
            if ((100 -notaActual) >= rubrica.pesoRubrica) {
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
            } else {
                console.error('Error en la nota: el peso excede el límite permitido.');
                throw new Error('Error, la suma de las evaluaciones debe ser <= 100');
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

const editarRubrica = async (codEvaluacion, rubricas, codClase) => {
    const client = await pool.connect(); 
    try {
        await client.query('BEGIN'); 
        
        for (const rubrica of rubricas) { 
            if (!rubrica.codRubrica) {
                // Registrar solo la rúbrica actual
                await registrarRubrica(codEvaluacion, [rubrica]);
            } else {
                const notaActual = await getNotaTotal(codClase);
                if ((100 - notaActual) >= rubrica.pesoRubrica) {
                    await client.query(
                        `UPDATE rubrica
                        SET nombre_rubrica = $1, descripcion_rubrica = $2, peso = $3
                        WHERE cod_rubrica = $4;`,
                        [rubrica.nombreRubrica, rubrica.descripcionRubrica, rubrica.pesoRubrica, rubrica.codRubrica]
                    );
            
                    if (rubrica.detallesRubrica && rubrica.detallesRubrica.length > 0) {
                        await detalleRubricaService.editarDetallesRubrica(client, rubrica.detallesRubrica);
                    }
                }               
            }      
        }
        
        await client.query('COMMIT');

    } catch (err) {
        await client.query('ROLLBACK'); // Revertir la transacción en caso de error
        console.error('Error al editar rúbrica', err);
        throw err; 
    } finally {
        client.release(); 
    }
};


const obtenerRubrica = async (codEvaluacion) => {
    try {
        // Obtener criterios de rúbrica
        const result = await pool.query(
            `SELECT cod_rubrica, nombre_rubrica, descripcion_rubrica, peso
             FROM rubrica
             WHERE cod_evaluacion = $1;`,
            [codEvaluacion]
        );

        const criterios = result.rows;

        // Añadir detalles de cada rúbrica
        for (const criterio of criterios) {
            const detalles = await obtenerDetallesPorRubrica(criterio.cod_rubrica);
            criterio.detalles = detalles;
        }

        return criterios; // Devolver criterios con sus detalles
    } catch (err) {
        console.error('Error al obtener la rúbrica', err);
        throw err;
    }
};

const getNotaTotal = async (codClase) => { 
    try {
        const result = await pool.query(
            `SELECT COALESCE(SUM(r.peso), 0) AS suma_pesos
             FROM rubrica r
             WHERE r.cod_evaluacion IN (
                 SELECT e.cod_evaluacion
                 FROM evaluacion e
                 WHERE cod_clase = $1
             )`,
            [codClase]
        );

        // Validar si existe un resultado
        if (result.rows.length === 0) {
            console.warn('No se encontraron rúbricas para la clase:', codClase);
            return 0; // Retornar 0 si no hay rúbricas
        }

        return result.rows[0].suma_pesos || 0; // Retornar la suma o 0
    } catch (err) {
        console.error('Error al obtener la nota total', err);
        throw err;
    }
};

module.exports = {
  registrarRubrica,
  obtenerRubricasConCalificaciones,
  obtenerRubricasPorEvaluacion,
  obtenerDetallesPorRubrica,
  editarRubrica,
  obtenerRubrica,
  getNotaTotal,
};
