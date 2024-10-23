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

module.exports = {
    getHorario,
    getCodHorario,  // Verifica que esté correctamente exportada
    registrarHorario,
};
