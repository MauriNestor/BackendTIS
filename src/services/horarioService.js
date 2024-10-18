const { pool } = require('../config/db');

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

module.exports = {
    getHorario,
    getCodHorario,  // Verifica que esté correctamente exportada
};
