const { pool } = require('../config/db');
const claseEtudianteService = require('../services/claseEstudianteService');

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

const generarReporte = async (codClase) => {
    try {
        const estudiantes = await claseEtudianteService.getEstudiantesXClase(codClase);
        let estudiantesConAsistencia = [];

        for (const estudiante of estudiantes) {
            const asistenciaResult = await pool.query(
                `SELECT fecha_asistencia, tipo_asistencia FROM asistencia 
                 WHERE codigo_sis = $1;`,
                [estudiante.codigo_sis]
            );

            // Formatear cada fecha de asistencia en el formato "YYYY-MM-DD"
            const asistencia = asistenciaResult.rows.map(registro => ({
                fecha: new Date(registro.fecha_asistencia).toLocaleDateString('en-CA'),  // formato "YYYY-MM-DD"
                estadoAsistencia: registro.tipo_asistencia
            }));

            estudiantesConAsistencia.push({
                ...estudiante,
                asistencia: asistencia
            });
        }

        return estudiantesConAsistencia;
        
    } catch (err) {
        console.error('Error al generar el reporte de asistencia', err);
        throw err;
    }
};



module.exports = {
    registrarAsistencia,
    generarReporte,
};