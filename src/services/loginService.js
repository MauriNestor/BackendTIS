const db = require('../config/db');
const bcrypt = require('bcrypt');

const obtenerDocente = async (correo, password) => {
    try {
        const query = 'SELECT cod_docente, password_docente FROM Docente WHERE correo = $1';
        const result = await db.pool.query(query, [correo]);

        if (result.rows.length === 0) {
            throw new Error('Credenciales incorrectas.');
        }

        const docente = result.rows[0];

        // Comparar la contraseña proporcionada con la contraseña encriptada
        const isMatch = await bcrypt.compare(password, docente.password_docente);

        if (!isMatch) {
            throw new Error('Credenciales incorrectas.');
        }

        // Retornar el cod_docente u otros datos necesarios
        return { cod_docente: docente.cod_docente };
    } catch (err) {
        console.error('Error al autenticar docente', err);
        throw err;
    }
};

const obtenerEstudiante = async (codigoSis, password, correo) => {
    try {
        const query = 'SELECT codigo_sis, password_estudiante FROM Estudiante WHERE codigo_sis = $1 AND correo_estudiante = $2';
        const result = await db.pool.query(query, [codigoSis, correo]);

        if (result.rows.length === 0) {
            throw new Error('Credenciales incorrectas.', err);
        }

        const estudiante = result.rows[0];

        // Comparar la contraseña proporcionada con la contraseña encriptada
        const isMatch = await bcrypt.compare(password, estudiante.password_estudiante);

        if (!isMatch) {
            throw new Error('Credenciales incorrectas.', err);
        }

        return { codigoSis: estudiante.codigo_sis};
    } catch (err) {
        console.error('Error al autenticar estudiante', err);
        throw err;
    }
};

module.exports = {
    obtenerDocente,
    obtenerEstudiante,
};

