const { pool } = require('../config/db');
const planificacionService = require('../services/planificacionService');

const getHorario = async (codigoHorario) => {
    try {
        const result = await pool.query(
            'SELECT dia_horario, hora_inicio, hora_fin FROM Horario  WHERE cod_horario = $1',
            [codigoHorario]
        );
        const horario = result.rows[0];
        return horario;

    }  catch (err) {
        console.error('Error al obtener el horario', err);
        throw err;
    }
};

const getCodHorario = async (codigoGrupo) => {
    try {
        const result = await pool.query(
            'SELECT cod_horario FROM grupo_empresa  WHERE cod_grupoempresa = $1',
            [codigoGrupo]
        );
        const codHorario = result.rows[0].cod_horario;
        return codHorario;

    }  catch (err) {
        console.error('Error al obtener el codigo del horario horario', err);
        throw err;
    }
};

const registrarHorario = async (codClase, horario) => {
    try {
        const codDocente = await planificacionService.getDocente(codClase);
        const result = await pool.query(
        `INSERT INTO Horario (cod_docente, cod_clase, dia_horario, hora_inicio, hora_fin)
	    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [codDocente, codClase, horario.diaHorario, horario.horaInicio, horaFin]
        );
        const codHorario = result.rows[0].cod_horario;
        return codHorario;

    }  catch (err) {
        console.error('Error al registrar el horario', err);
        throw err;
    }
};


const verificarHorarioDuplicado = async ({ codClase, hora_inicio, hora_fin, dia_horario }) => {
    try {
        const result = await pool.query(
            `SELECT * FROM horario 
             WHERE cod_clase = $1 
               AND dia_horario = $2 
               AND ((hora_inicio <= $3 AND hora_fin > $3) OR (hora_inicio < $4 AND hora_fin >= $4))`,
            [codClase, dia_horario, hora_inicio, hora_fin]
        );

        return result.rows.length > 0;
    } catch (error) {
        console.error('Error al verificar horario duplicado:', error);
        throw error;
    }
};

const postHorario = async ({ codClase, cod_docente, hora_inicio, hora_fin, dia_horario }) => {
    try {
        const claseResult = await pool.query(
            `SELECT cod_clase FROM clase WHERE cod_clase = $1 AND cod_docente = $2`,
            [codClase, cod_docente]
        );

        if (claseResult.rows.length === 0) {
            throw new Error('No se encontró la clase o el docente no está asociado a esta clase');
        }

        const horarioDuplicado = await verificarHorarioDuplicado({ codClase, hora_inicio, hora_fin, dia_horario });
        if (horarioDuplicado) {
            throw new Error('Ya existe un horario en el mismo día y hora');
        }
        const horarioResult = await pool.query(
            `INSERT INTO horario (hora_inicio, hora_fin, dia_horario, cod_docente, cod_clase) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [hora_inicio, hora_fin, dia_horario, cod_docente, codClase]
        );

        return horarioResult.rows[0];
    } catch (error) {
        console.error('Error al registrar horario:', error);
        throw error;
    }
};

module.exports = {
    getHorario,
    getCodHorario,  // Verifica que esté correctamente exportada
    registrarHorario,
    postHorario,
    verificarHorarioDuplicado
};
