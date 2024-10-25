const db = require('../config/db');
const pool = db.pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const restablecerPassword = async (newPassword, token) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Verificar el token para asegurarse de que es válido
        const decoded = jwt.verify(token, 'SECRET_KEY');
        console.log(decoded);

        let result;
        let passwordAceptado;
        if (decoded.usuario === "Estudiante") {
            passwordAceptado = await verificarPassword(newPassword,decoded.usuarioCorreo, decoded.usuario);
            if (passwordAceptado) {
                result = await pool.query(
                    'UPDATE Estudiante SET password_estudiante = $1 WHERE correo_estudiante = $2',
                    [hashedPassword, decoded.usuarioCorreo]
                );
            } else {
                throw new Error('No se puede poner la misma contraseña.');
            }
            
        } else {
            passwordAceptado = await verificarPassword(newPassword,decoded.usuarioCorreo, "Docente");
            if (passwordAceptado) {
                result = await pool.query(
                    'UPDATE Docente SET password_docente = $1 WHERE correo = $2',
                    [hashedPassword, decoded.usuarioCorreo]
                );
            }else {
                throw new Error('No se puede poner la misma contraseña.');
            }
            
        }

        // Verificar si alguna fila fue afectada (si la contraseña fue actualizada)
        if (result.rowCount > 0) {
            return { success: true, message: 'Contraseña actualizada con éxito.' };
        } else {
            return { success: false, message: 'No se encontró al usuario.' };
        }

    } catch (err) {
        console.error('Error al cambiar la contraseña', err);
        throw err;
    }
};

const verificarPassword = async (newPassword, correo, rol) => {
    try {
        let result;
        let password;

        if (rol === "Estudiante") {
            result = await pool.query(
                'SELECT password_estudiante FROM Estudiante WHERE correo_estudiante = $1',
                [correo]
            );
            // Verifica si existe un resultado
            if (result.rows.length > 0) {
                password = result.rows[0].password_estudiante;
            } else {
                throw new Error('No se encontró al estudiante.');
            }
        } else {
            result = await pool.query(
                'SELECT password_docente FROM Docente WHERE correo = $1',
                [correo]
            );
            // Verifica si existe un resultado
            if (result.rows.length > 0) {
                password = result.rows[0].password_docente;
            } else {
                throw new Error('No se encontró al docente.');
            }
        }

        // Compara la nueva contraseña con la existente
        const isMatch = await bcrypt.compare(newPassword, password);

        // Retorna true si las contraseñas no coinciden, es decir, si es una nueva contraseña
        return !isMatch;

    } catch (err) {
        console.error('Error al verificar contraseña', err);
        throw err;
    }
};


module.exports = {
    restablecerPassword,
};
