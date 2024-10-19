const { pool } = require('../config/db');
const planificacionService = require('../services/planificacionService');
const temaService = require('../services/temaService');
const entregableService = require('../services/entregableService');

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


// const { pool } = require('../config/db');

exports.subirEntregable = async (cod_evaluacion, archivo_grupo, codigo_sis) => {
    try {
        // Primero, obtenemos el cod_docente y cod_clase desde la evaluación
        const evaluacionResult = await pool.query(
            `SELECT e.cod_docente, e.cod_clase
             FROM evaluacion e
             WHERE e.cod_evaluacion = $1`,
            [cod_evaluacion]
        );

        if (evaluacionResult.rows.length === 0) {
            throw new Error('No se encontró la evaluación o los datos relacionados.');
        }

        const cod_docente = evaluacionResult.rows[0].cod_docente;
        const cod_clase = evaluacionResult.rows[0].cod_clase;

        // Obtenemos el cod_grupoempresa y cod_horario del grupo empresa del estudiante
        const grupoResult = await pool.query(
            `SELECT ge.cod_grupoempresa, ge.cod_horario
             FROM grupo_empresa ge
             INNER JOIN grupo_estudiante ge_stu ON ge.cod_grupoempresa = ge_stu.cod_grupoempresa
             WHERE ge_stu.codigo_sis = $1 AND ge.cod_clase = $2`,
            [codigo_sis, cod_clase]
        );

        if (grupoResult.rows.length === 0) {
            throw new Error('No se encontró el grupo empresa asociado al estudiante.');
        }

        const cod_grupoempresa = grupoResult.rows[0].cod_grupoempresa;
        const cod_horario = grupoResult.rows[0].cod_horario; // Obtenemos el cod_horario aquí

        // Convertir archivo a buffer (si está presente)
        const archivoBuffer = archivo_grupo ? Buffer.from(archivo_grupo, 'base64') : null;

        // Insertar el entregable en la base de datos
        const query = `
            INSERT INTO entregable (cod_horario, cod_evaluacion, cod_docente, observaciones_entregable, cod_clase, archivo_grupo, cod_grupoempresa)
            VALUES ($1, $2, $3, null, $4, $5, $6)
        `;
        const values = [cod_horario, cod_evaluacion, cod_docente, cod_clase, archivoBuffer, cod_grupoempresa];

        await pool.query(query, values);

        return { message: 'Entregable subido exitosamente' };
    } catch (error) {
        console.error('Error al subir el entregable:', error);
        throw new Error('Error al subir el entregable');
    }
};