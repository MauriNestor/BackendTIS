const { pool } = require('../config/db');

const registrarDetallesRubrica = async (codEvaluacion, codigoRubrica, detalles) => {
    try {
        let clasificacion, peso, descripcion;
        const codDetalles = []; 
        for (const detalle of detalles) {
            clasificacion = detalle.clasificacion;
            peso = detalle.peso;
            descripcion = detalle.descripcion;

            if (!clasificacion || !peso || !descripcion) {
                throw new Error('Todos los campos de detalle deben estar completos.');
            }

            const result = await pool.query(
                `INSERT INTO detalle_rubrica (cod_evaluacion, cod_rubrica, clasificacion_rubrica, peso_rubrica, descripcion) 
                VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
                [codEvaluacion, codigoRubrica, clasificacion, peso, descripcion]
            );
            codDetalles.push(result.rows[0].cod_detalle);
        }
        return codDetalles; 

    } catch (err) {
        console.error('Error al registrar detalles de rubrica', err);
        throw err;
    }
};

module.exports = {
    registrarDetallesRubrica,
};
