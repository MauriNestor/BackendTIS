const db = require('../config/db');

const obtenerDocente = async (correo, password) => {
    try {
        const query = 'SELECT cod_docente FROM Docente WHERE correo = $1 AND password_docente = $2';

        const result = await db.pool.query(query, [correo, password]);
        const data = result.rows;

        if (data.length === 0) {
            throw new Error('Correo o contraseña incorrectos.');
        }

        return data;  
    } catch (err) {
        console.error('Error al obtener docente:', err);
        throw err; 
    }
};

module.exports = {
    obtenerDocente,
};
