const { pool } = require('../config/db');

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

        return {
            ...evaluacion,
            archivo_evaluacion: evaluacion.archivo_evaluacion ? evaluacion.archivo_evaluacion.toString('base64') : null
        };
    } else {
        return null;
    }
};


exports.obtenerEstadoEntregas = async (codDocente, codEvaluacion) => {
    try {
        const query = `
        SELECT
            ge.cod_grupoempresa,
            ge.nombre_corto,
            ge.nombre_largo,
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
        return result.rows;
    } catch (error) {
        console.error('Error al obtener las entregas', error);
        throw error;
    }
};
