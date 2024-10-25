const {pool} = require('../config/db');
const bcrypt = require('bcrypt');

const EstudianteService = {
    createEstudiante: async ({codigo_sis, nombres, apellidos, correo, contraseña}) => {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

        const result = await pool.query(
            'INSERT INTO estudiante (CODIGO_SIS, NOMBRE_ESTUDIANTE, APELLIDO_ESTUDIANTE, CORREO_ESTUDIANTE, PASSWORD_ESTUDIANTE) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [codigo_sis, nombres, apellidos, correo, hashedPassword]
        );
        return result.rows[0];
    },

    getAllEstudiantes: async () => {
        const result = await pool.query('SELECT * FROM ESTUDIANTE');
        return result.rows;
    },

    setPassword: async ({codigo_sis, correo, newPassword}) => {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            const result = await pool.query(
                'UPDATE Estudiante SET password_estudiante = $1 WHERE codigo_Sis = $2 AND correo_estudiante = $3',
                [hashedPassword, codigo_sis, correo]
            );
            return { success: true, message: 'Contraseña actualizada con éxito.' };
        } catch {
            console.error('Error al cambiar la contraseña del estudiante', err);
            throw err;
        }
    }
};
module.exports = EstudianteService;


