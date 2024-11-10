const { pool } = require('../config/db');

const registrarAsistencia = async (codClase, listaAsistencia) => {
    try {
        const fecha = new Date().toLocaleDateString('en-CA');

        for (const asistencia of listaAsistencia) {
            const result = await pool.query(
                `INSERT INTO asistencia (cod_clase, codigo_sis, fecha_asistencia, tipo_asistencia) 
                VALUES ($1, $2, $3, $4) RETURNING *;`,
                [codClase, asistencia.codigoSis, fecha, asistencia.estado]
            );
        }
        
        return listaAsistencia;
        
    } catch (err) {
        console.error('Error al registrar la asistencia', err);
        throw err;
    }
}; 


module.exports = {
    registrarAsistencia,
};