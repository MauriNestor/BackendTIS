const { pool } = require('../config/db');
const planificacionService = require('../services/planificacionService');
const temaService = require('../services/temaService');
const entregableService = require('../services/entregableService');
const grupoEmpresaService = require('../services/grupoEmpresaService');
const evaluacionCruzadaService = require('../services/evaluacionCruzadaService');
const rubricaService = require('../services/rubricaService');
const grupoEstudianteService = require('../services/grupoEstudianteService');

exports.getEvaluacionesByClass = async (cod_clase) => {
    const result = await pool.query(`
        SELECT t.cod_tema, t.nombre_tema, json_agg(
            json_build_object(
                'cod_evaluacion', e.cod_evaluacion,
                'evaluacion', e.evaluacion,
                'fecha_fin', e.fecha_fin,
                'fecha_inicio', e.fecha_inicio,
                'tipo_evaluacion', e.tipo_evaluacion,
                'descripcion_evaluacion', e.descripcion_evaluacion
            )
        ) AS evaluaciones
        FROM tema t
        LEFT JOIN evaluacion e ON t.cod_tema = e.cod_tema
        WHERE t.cod_clase = $1
        GROUP BY t.cod_tema, t.nombre_tema
    `, [cod_clase]);
    return result.rows;
};

exports.getEvaluacionesByClassForStudent = async (cod_clase, codigoSis) => {
    const query = `
        SELECT t.cod_tema, t.nombre_tema, json_agg(
            json_build_object(
                'cod_evaluacion', e.cod_evaluacion,
                'evaluacion', e.evaluacion,
                'fecha_fin', e.fecha_fin,
                'fecha_inicio', e.fecha_inicio,
                'tipo_evaluacion', e.tipo_evaluacion,
                'descripcion_evaluacion', e.descripcion_evaluacion
            )
        ) AS evaluaciones
        FROM tema t
        LEFT JOIN evaluacion e ON t.cod_tema = e.cod_tema
        LEFT JOIN entregable en ON en.cod_evaluacion = e.cod_evaluacion
        LEFT JOIN grupo_estudiante gs ON gs.cod_grupoempresa = en.cod_grupoempresa AND gs.codigo_sis = $2
        WHERE t.cod_clase = $1
          AND gs.codigo_sis = $2  -- Estudiante está en el grupo con un entregable asociado
        GROUP BY t.cod_tema, t.nombre_tema
    `;

    const queryParams = [cod_clase, codigoSis];
    const result = await pool.query(query, queryParams);

    return result.rows;
};


exports.getEvaluacionById = async (cod_evaluacion) => {
    const result = await pool.query(
        'SELECT cod_evaluacion, cod_tema, evaluacion, fecha_fin, fecha_inicio, tipo_evaluacion, descripcion_evaluacion, archivo_evaluacion FROM EVALUACION WHERE cod_evaluacion = $1',
        [cod_evaluacion]
    );
   if (result.rows.length > 0) {
        const evaluacion = result.rows[0];

        const mimeType = evaluacion.archivo_evaluacion ? 'application/pdf' : null;

        return {
            ...evaluacion,
            archivo_evaluacion: evaluacion.archivo_evaluacion ? evaluacion.archivo_evaluacion.toString('base64') : null,
            mime_type: mimeType
        };
    } else {
        return null;
    }
};

exports.registrarEvaluacion = async (codClase, tema, nombreEvaluacion, tipoEvaluacion, fechaEntrega, archivo, descripcion, codigosGrupos) => {
    try {
        const codDocente = await planificacionService.getDocente(codClase);
        console.log(codDocente);
        const codTema = await temaService.registrarTema(tema, codClase, codDocente);
        console.log(codTema);
        const fechaInicio = new Date().toISOString().split('T')[0]; 
        const result = await pool.query(
            `INSERT INTO Evaluacion (cod_docente, cod_clase, cod_tema, evaluacion, tipo_evaluacion, fecha_inicio, fecha_fin, archivo_evaluacion, descripcion_evaluacion) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
            [codDocente, codClase, codTema, nombreEvaluacion, tipoEvaluacion, fechaInicio, fechaEntrega, archivo, descripcion ]
        );
        codEvaluacion = result.rows[0].cod_evaluacion;
        // Verifica si se enviaron `codigosGrupos`
        if (tipoEvaluacion === "Evaluación cruzada") {
            const asignacionGrupos = await evaluacionCruzadaService.registrarEvalCruzada(codEvaluacion, codClase);
            //return codEvaluacion;
        }
        if (codigosGrupos && codigosGrupos.length > 0) {
            // Realiza la asignación de evaluación
            const asignacionExitosa = await entregableService.asignarEvaluacion(codDocente, codClase, codEvaluacion, codigosGrupos);
            
            if (asignacionExitosa) {
                return codEvaluacion; // Retorna el código de la evaluación si la asignación fue exitosa
            } else {
                throw new Error('Error en la asignación de evaluación'); // Lanza un error si la asignación falla
            }
        } else {
            // Si no hay `codigosGrupos`, simplemente retorna el código de la evaluación
            return codEvaluacion;
        }
    }  catch (err) {
        console.error('Error al registrar tema', err);
        throw err;
    }
};


exports.obtenerEstadoEntregas = async (codDocente, codEvaluacion) => {
    try {
        const query = `
        SELECT
            ge.cod_grupoempresa,
            ge.nombre_corto,
            ge.nombre_largo,
            ge.logotipo,
            CASE WHEN ent.archivo_grupo IS NOT NULL THEN TRUE ELSE FALSE END AS ha_entregado
        FROM
            evaluacion ev
        INNER JOIN
            clase c ON ev.cod_clase = c.cod_clase
        INNER JOIN
            grupo_empresa ge ON ge.cod_clase = c.cod_clase
        LEFT JOIN
            entregable ent ON ge.cod_grupoempresa = ent.cod_grupoempresa AND ent.cod_evaluacion = ev.cod_evaluacion
        WHERE
            ev.cod_evaluacion = $1
            AND c.cod_docente = $2
        ORDER BY
            ge.nombre_corto;
        `;
        const values = [codEvaluacion, codDocente];
        
        const result = await pool.query(query, values);
        
        const gruposConLogo = result.rows.map(grupo => ({
            ...grupo,
            logotipo: grupo.logotipo ? grupo.logotipo.toString('base64') : null
        }));
        
        return gruposConLogo;
    } catch (error) {
        console.error('Error al obtener las entregas', error);
        throw error;
    }
};

const obtenerDocenteYClasePorEvaluacion = async (cod_evaluacion) => {
    try {
        const result = await pool.query(
            `SELECT e.cod_docente, e.cod_clase
             FROM evaluacion e
             WHERE e.cod_evaluacion = $1`,
            [cod_evaluacion]
        );
        if (result.rows.length === 0) {
            throw new Error('No se encontró la evaluación o los datos relacionados.');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error al obtener datos del docente y clase por evaluación', error);
        throw error;
    }
};

exports.subirEntregable = async (cod_evaluacion, archivo_grupo, codigo_sis) => {
    try {
        const limiteTamanioArchivo = 10 * 1024 * 1024; 
        const archivoBuffer = archivo_grupo ? Buffer.from(archivo_grupo, 'base64') : null;

        if (archivoBuffer && archivoBuffer.length > limiteTamanioArchivo) {
            return res.status(400).json({ error: `El archivo excede el límite de tamaño permitido de ${limiteTamanioArchivo / (1024 * 1024)} MB` });
        }
        const { cod_docente, cod_clase } = await obtenerDocenteYClasePorEvaluacion(cod_evaluacion);

        const { cod_grupoempresa, cod_horario } = await grupoEmpresaService.obtenerGrupoYHorarioDelEstudiante(codigo_sis, cod_clase);

        const entregableExistente = await pool.query(
            `SELECT * FROM entregable 
             WHERE cod_evaluacion = $1 AND cod_grupoempresa = $2`,
            [cod_evaluacion, cod_grupoempresa]
        );

        if (entregableExistente.rows.length === 0) {
            return { error: 'No se encontró el entregable asignado para este grupo y evaluación' };
        }
        await pool.query(
            `UPDATE entregable
             SET archivo_grupo = $1
             WHERE cod_evaluacion = $2 AND cod_grupoempresa = $3`,
            [archivoBuffer, cod_evaluacion, cod_grupoempresa]
        );

        return { message: 'Archivo del entregable actualizado exitosamente' };
    } catch (error) {
        console.error('Error al subir el entregable:', error);
        throw new Error('Error al subir el entregable');

    }
};

exports.eliminarEvaluacion = async (codEvaluacion) => {
    try {
        const evalResult = await pool.query(
            `SELECT * FROM evaluacion WHERE cod_evaluacion = $1`,
            [codEvaluacion]
        );

        if (evalResult.rows.length === 0) {
            return { error: 'La evaluación no existe o ya a sido elimnada', status: 404 };
        }
        const evaluacionEliminada = evalResult.rows[0];
        
        await pool.query('BEGIN');

        await pool.query(`DELETE FROM calificacion_rubrica WHERE cod_evaluacion = $1`, [codEvaluacion]);
        await pool.query(`DELETE FROM detalle_rubrica WHERE cod_evaluacion = $1`, [codEvaluacion]);
        await pool.query(`DELETE FROM retroalimentacion_grupal WHERE cod_evaluacion = $1`, [codEvaluacion]);
        await pool.query(`DELETE FROM retroalimentacion_individual WHERE cod_evaluacion = $1`, [codEvaluacion]);
        await pool.query(`DELETE FROM rubrica WHERE cod_evaluacion = $1`, [codEvaluacion]);
        await pool.query(`DELETE FROM entregable WHERE cod_evaluacion = $1`, [codEvaluacion]);
        // await pool.query(`DELETE FROM tema WHERE cod_tema = $1`, [evaluacionEliminada.cod_tema]); 

        await pool.query(`DELETE FROM evaluacion WHERE cod_evaluacion = $1`, [codEvaluacion]);

        await pool.query('COMMIT');

        return { 
            message: 'Evaluación eliminada exitosamente', 
            evaluacion: evaluacionEliminada 
        };
    } catch (error) {
        console.error('Error al eliminar la evaluación:', error);
        throw new Error('Error al eliminar la evaluación');
    }
};

exports.getListaGruposEntregaronEvaluacion = async (codEvaluacion, codigoSis) => {
    try {
        const { cod_clase } = await obtenerDocenteYClasePorEvaluacion(codEvaluacion);

        const { cod_grupoempresa } = await grupoEmpresaService.obtenerGrupoYHorarioDelEstudiante(codigoSis, cod_clase);
        const entregableResult = await pool.query(
            `SELECT archivo_grupo FROM entregable
             WHERE cod_evaluacion = $1 AND cod_grupoempresa = $2`,
            [codEvaluacion, cod_grupoempresa]
        );

        return entregableResult.rows.length > 0 ? entregableResult.rows[0].archivo_grupo : null;

    } catch (error) {
        console.error('Error en obtenerEntregablePorEvaluacionYGrupo:', error);
        throw error;
    }
};


exports.getTipoEvaluacion = async (codEvaluacion) => {
    try {
        const result = await pool.query(
            `SELECT tipo_evaluacion FROM evaluacion
             WHERE cod_evaluacion = $1`,
            [codEvaluacion]
        );
        if (result.rows.length === 0) {
            console.error(`No se encontró el tipo de evaluación para cod_evaluacion: ${codEvaluacion}`);
            return null; // O lanza un error personalizado si prefieres
        }
        
        return result.rows[0].tipo_evaluacion; 

    } catch (error) {
        console.error('Error al obterner el tipo de evaluacion:', error);
        throw error;
    }
};

exports.obtenerNotasDetalladasEstudiante = async (cod_evaluacion, codigo_sis, codClase) => {
    try {
        const rubricas = await rubricaService.obtenerRubricasPorEvaluacion(cod_evaluacion);

        const cod_grupoempresa = await grupoEstudianteService.getCodGrupo(codigo_sis, codClase);

        const retroalimentacionResult = await pool.query(
            `SELECT comentario, fecha_registro
             FROM retroalimentacion_grupal
             WHERE cod_grupoempresa = $1 AND cod_evaluacion = $2`,
            [cod_grupoempresa, cod_evaluacion]
        );
        const retroalimentacion = retroalimentacionResult.rows.length > 0
        ? retroalimentacionResult.rows[0]
        : { comentario: null, fecha_registro: null };

        const rubricasConCalificacionesYDetalles = await Promise.all(
            rubricas.map(async (rubrica) => {

                const calificacionResult = await pool.query(
                    `SELECT cr.calificacion
                     FROM calificacion_rubrica cr
                     WHERE cr.cod_rubrica = $1 AND cr.cod_evaluacion = $2 AND cr.codigo_sis = $3`,
                    [rubrica.cod_rubrica, cod_evaluacion, codigo_sis]
                );

                const calificacion = calificacionResult.rows.length > 0
                    ? calificacionResult.rows[0]
                    : { calificacion: null, observacion: null };

                const detalles = await rubricaService.obtenerDetallesPorRubrica(rubrica.cod_rubrica);

                return {
                    ...rubrica,
                    calificacion: calificacion.calificacion,
                    observacion: calificacion.observacion,
                    detalles: detalles
                };
            })
        );

        const notaTotal = rubricasConCalificacionesYDetalles.reduce((acc, rubrica) => {
            return acc + (rubrica.calificacion || 0);
        }, 0);

        return {
            nota_total: notaTotal,
            rubricas: rubricasConCalificacionesYDetalles,
            retroalimentacion: retroalimentacion
        };
    } catch (error) {
        console.error('Error al obtener las notas detalladas del estudiante:', error);
        throw new Error('Error al obtener las notas detalladas del estudiante');
    }
};

exports.obtenerRubricasYDetallesDocente = async (cod_evaluacion) => {
    try {
        const rubricas = await rubricaService.obtenerRubricasPorEvaluacion(cod_evaluacion);

        const rubricasConDetalles = await Promise.all(
            rubricas.map(async (rubrica) => {
                const detalles = await rubricaService.obtenerDetallesPorRubrica(rubrica.cod_rubrica);

                return {
                    ...rubrica,
                    detalles: detalles
                };
            })
        );
        return {
            rubricas: rubricasConDetalles
        };
    } catch (error) {
        console.error('Error al obtener las rúbricas y detalles para el docente:', error);
        throw new Error('Error al obtener las rúbricas y detalles para el docente');
    }
};

exports.editarEvaluacion = async (codEvaluacion, evaluacion) => {
    try {
        // Verificar la existencia de la evaluación
        const checkQuery = `SELECT cod_evaluacion FROM evaluacion WHERE cod_evaluacion = $1`;
        const checkResult = await pool.query(checkQuery, [codEvaluacion]);

        if (checkResult.rowCount === 0) {
            throw new Error("La evaluación especificada no existe.");
        }

        // Actualizar los datos de la evaluación
        await pool.query(
            `UPDATE evaluacion
             SET evaluacion = $1, descripcion_evaluacion = $2, fecha_fin = $3
             WHERE cod_evaluacion = $4`,
            [evaluacion.nombreEvaluacion, evaluacion.descripcion, evaluacion.fechaEntrega, codEvaluacion]
        );
    } catch (error) {
        console.error('Error al editar la evaluación:', error);
        throw new Error(error.message || 'Error al editar la evaluación.');
    }
};

