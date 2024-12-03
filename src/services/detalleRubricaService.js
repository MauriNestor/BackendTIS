const { pool } = require('../config/db');

const registrarDetallesRubrica = async (client, codEvaluacion, codigoRubrica, detalles) => {
    try {
        const codDetalles = []; 

        for (const detalle of detalles) {
            const { clasificacion, peso, descripcion } = detalle;

            // Validar que todos los campos estén completos
            if (typeof clasificacion === 'undefined' || 
                (typeof peso !== 'number' && isNaN(peso)) || 
                typeof descripcion === 'undefined') {
                throw new Error('Todos los campos de detalle deben estar completos. Clasificacion: ' + clasificacion + ', Peso: ' + peso + ', Descripcion: ' + descripcion);
            }

            const result = await client.query(
                `INSERT INTO detalle_rubrica (cod_evaluacion, cod_rubrica, clasificacion_rubrica, peso_rubrica, descripcion) 
                VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
                [codEvaluacion, codigoRubrica, clasificacion, peso, descripcion]
            );

            // Guardar el código del detalle registrado
            codDetalles.push(result.rows[0].cod_detalle);
        }

        return codDetalles; 

    } catch (err) {
        console.error('Error al registrar detalles de rubrica', err);
        throw err; 
    }
};

const editarDetallesRubrica = async (client, detalles) => {
    try {

        for (const detalle of detalles) {
            const {codDetalle,  clasificacion, peso, descripcion } = detalle;

            // Validar que todos los campos estén completos
            if (typeof clasificacion === 'undefined' || 
                (typeof peso !== 'number' && isNaN(peso)) || 
                typeof descripcion === 'undefined') {
                throw new Error('Todos los campos de detalle deben estar completos. Clasificacion: ' + clasificacion + ', Peso: ' + peso + ', Descripcion: ' + descripcion);
            }

            const result = await client.query(
                `UPDATE detalle_rubrica
                SET clasificacion_rubrica = $1, descripcion = $2, peso_rubrica = $3
                WHERE cod_detalle = $4 RETURNING *;`,
                [clasificacion, descripcion, peso, codDetalle]
            );
        }

    } catch (err) {
        console.error('Error al editar detalles de rubrica', err);
        throw err; 
    }
};

module.exports = {
    registrarDetallesRubrica,
    editarDetallesRubrica,
};
