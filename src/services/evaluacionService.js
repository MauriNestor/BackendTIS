const { pool } = require('../config/db');

exports.getEvaluacionesByClass = async (cod_clase) => {
    const result = await pool.query(`
        SELECT t.cod_tema, t.nombre_tema, json_agg(
            json_build_object(
                'cod_evaluacion', e.cod_evaluacion,
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


exports.getEvaluacionesById = async (req, res) => {
    const result = await pool.query(
        'SELECT cod_evaluacion, cod_tema, fecha_fin, fecha_inicio, tipo_evaluacion, descripcion_evaluacion FROM EVALUACION WHERE cod_evaluacion = $1',
        [req.params.cod_evaluacion]
    );
    return res.status(200).json(result.rows[0]);
}
