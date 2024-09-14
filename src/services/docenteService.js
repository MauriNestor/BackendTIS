const {pool} = require('../config/db');

const DocentesService = {
    createDocente: async ({nombre, apellido, correo, contraseña}) => {
        const result = await pool.query(
            'INSERT INTO DOCENTE (nombre_docente, apellido_docente, correo, password_docente) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, apellido,correo, contraseña]            
        );
        return result.rows[0];
    },

    getAllDocentes: async () => {
        const result = await pool.query('SELECT * FROM DOCENTE');
        return result.rows;
    }
};
module.exports = DocentesService;  

