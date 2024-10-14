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

module.exports = {
    getHorario,
};
