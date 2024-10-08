const {pool} = require('../config/db');
const bcrypt = require('bcrypt');

const DocentesService = {
    createDocente: async ({nombre, apellido, correo, contraseña}) => {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

        const result = await pool.query(
            'INSERT INTO DOCENTE (nombre_docente, apellido_docente, correo, password_docente) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, apellido,correo, hashedPassword]            
        );
        return result.rows[0];
    },

    getAllDocentes: async () => {
        const result = await pool.query('SELECT * FROM DOCENTE');
        return result.rows;
    },

    getDocente: async (codDocente) => {
        const result = await pool.query(
            'SELECT nombre_docente, apellido_docente FROM DOCENTE WHERE cod_docente = $1', 
            [codDocente]
        );
        return result.rows;
    }    
};
module.exports = DocentesService;  

