const { pool } = require('../config/db');
const grupoEmpresaService = require('./grupoEmpresaService');
const rubricaService = require('./rubricaService');

exports.generarReporteNotasPorGrupo = async (codigoGrupo) => {
    try {
        // Obtener datos del grupo y sus integrantes
        const grupo = await grupoEmpresaService.getGrupoEmpresa(codigoGrupo);

        if (!grupo || !grupo.integrantes || grupo.integrantes.length === 0) {
            return { message: 'No se encontraron integrantes en el grupo.' };
        }

        // Obtener las evaluaciones asociadas al grupo
        const evaluacionesQuery = `
            SELECT cod_evaluacion, evaluacion, fecha_inicio, fecha_fin
            FROM evaluacion
            WHERE cod_clase = $1
        `;
        const evaluaciones = await pool.query(evaluacionesQuery, [grupo.cod_clase]);

        // Obtener las notas de cada estudiante para cada evaluación
        const estudiantesConNotas = await Promise.all(
            grupo.integrantes.map(async (integrante) => {
                const notas = await Promise.all(
                    evaluaciones.rows.map(async (evaluacion) => {
                        // Obtener todas las rúbricas para la evaluación
                        const rubricas = await rubricaService.obtenerRubricasPorEvaluacion(evaluacion.cod_evaluacion);

                        // Sumar las calificaciones de todas las rúbricas para este estudiante en esta evaluación
                        const notaTotal = await Promise.all(
                            rubricas.map(async (rubrica) => {
                                const calificacionResult = await pool.query(
                                    `SELECT cr.calificacion
                                     FROM calificacion_rubrica cr
                                     WHERE cr.cod_rubrica = $1 AND cr.cod_evaluacion = $2 AND cr.codigo_sis = $3`,
                                    [rubrica.cod_rubrica, evaluacion.cod_evaluacion, integrante.codigo_sis]
                                );

                                return calificacionResult.rows.length > 0
                                    ? calificacionResult.rows[0].calificacion
                                    : 0;
                            })
                        ).then(calificaciones => calificaciones.reduce((acc, curr) => acc + curr, 0));

                        return {
                            cod_evaluacion: evaluacion.cod_evaluacion,
                            evaluacion: evaluacion.evaluacion,
                            fecha_inicio: evaluacion.fecha_inicio,
                            fecha_fin: evaluacion.fecha_fin,
                            calificacion: notaTotal
                        };
                    })
                );

                return {
                    estudiante: integrante,
                    notas
                };
            })
        );

        // Construir el reporte
        return {
            grupo: {
                nombre_corto: grupo.nombre_corto,
                nombre_largo: grupo.nombre_largo,
                logotipo: grupo.logotipo
            },
            estudiantes: estudiantesConNotas
        };
    } catch (error) {
        console.error('Error al generar el reporte de notas por grupo:', error);
        throw new Error('Error al generar el reporte de notas por grupo.');
    }
};
