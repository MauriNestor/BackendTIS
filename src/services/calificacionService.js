const { pool } = require('../config/db');
const planificacionService = require('../services/planificacionService');

const calificarEstudiante = async (codEvaluacion, codigoSis, notas, comentario) => {
    try {
        for (const nota of notas) {

            const result = await pool.query(
                `INSERT INTO calificacion_rubrica (cod_evaluacion, cod_rubrica, codigo_sis, calificacion) 
                VALUES ($1, $2, $3, $4) RETURNING *;`,
                [codEvaluacion, nota.codRubrica, codigoSis, nota.nota]
            );
        }
        const comentarioGuardado = await comentarIndividual(codEvaluacion, codigoSis, comentario);
        if(comentarioGuardado) {
            return true;
        }
    } catch (err) {
        console.error('Error al crear entregable', err);
        throw err;
    }
}; 

const comentarIndividual = async (codEvaluacion, codigoSis, comentario) => {
    try {
            const result = await pool.query(
                `INSERT INTO retroalimentacion_individual (cod_evaluacion, codigo_sis, comentario_individual) 
                VALUES ($1, $2, $3) RETURNING *;`,
                [codEvaluacion, codigoSis, comentario]
            );
            return true;
        
    } catch (err) {
        console.error('Error al crear entregable', err);
        throw err;
    }
};

const retroalimentar = async (codEvaluacion, codClase, codGrupo, fecha, comentario) => {
    try {
        const codDocente = await planificacionService.getDocente(codClase);
        //const fecha = new Date().toLocaleDateString('en-CA');
        const result = await pool.query(
            `INSERT INTO retroalimentacion_grupal (cod_docente, cod_clase, cod_grupoempresa, cod_evaluacion, comentario, fecha_registro) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
            [codDocente, codClase, codGrupo, codEvaluacion, comentario, fecha]
        );
        console.log(result.rows[0].cod_retroalimentacion);
        return result.rows[0].cod_retroalimentacion;
        
    } catch (err) {
        console.error('Error al crear entregable', err);
        throw err;
    }
};

module.exports = {
    calificarEstudiante,
    retroalimentar,
};