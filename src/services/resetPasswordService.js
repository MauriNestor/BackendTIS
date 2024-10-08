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
        
        if (decoded.usuario === "Estudiante") {
            result = await pool.query(
                'UPDATE Estudiante SET password_estudiante = $1 WHERE correo_estudiante = $2',
                [hashedPassword, decoded.usuarioCorreo]
            );
        } else {
            result = await pool.query(
                'UPDATE Docente SET password_docente = $1 WHERE correo = $2',
                [hashedPassword, decoded.usuarioCorreo]
            );
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

module.exports = {
    restablecerPassword,
};
