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
    }
};
module.exports = EstudianteService;

