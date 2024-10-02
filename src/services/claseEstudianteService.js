const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const planificacionService = require('../services/planificacionService');


const unirseClase = async (token, codigoClase) => {
    try {
        const claseValida = await verificarClase(codigoClase);

        if (claseValida) {
            const decoded = jwt.decode(token);
            console.log(decoded);
            codigoSis = decoded.codigoSis;

            const claseValidaEstudiante = await verificarClaseEstudiante(codigoClase, codigoSis);
            if (claseValidaEstudiante) {
                const codigoDocente = await planificacionService.getDocente(codigoClase); 

                const query = 'INSERT INTO  Clase_estudiante (cod_docente, cod_clase, codigo_sis) VALUES ($1, $2, $3) RETURNING *';
                const result = await db.pool.query(query, [codigoDocente, codigoClase, codigoSis]);

                return { success: true, message: 'Estudiante registrado.'};
            } else {
                return { success: false, message: 'Ya se encuentra registrado en esta clase.' };
            };
        } else {
            console.log('No existe esta clase registrada:', codigoClase);
            return { success: false, message: 'No se encontró una clase con este código.' };
        };

    } catch (err) {
        console.error('Error al unirse a clase', err);
        throw err;
    }
};

const verificarClase = async (codigoClase) => {
    try {
        result = await pool.query(
            'SELECT * FROM Clase WHERE cod_clase = $1',
            [codigoClase]
        );

        if (result.rowCount > 0) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error('Error al buscar clase', err);
        throw err;
    }
};

const verificarClaseEstudiante = async (codigoClase, codigoSis) => {
    try {
        result = await pool.query(
            'SELECT * FROM Clase_estudiante WHERE cod_clase = $1 AND codigo_sis = $2',
            [codigoClase, codigoSis]
        );

        if (result.rowCount > 0) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.error('Error al buscar clase estudiante', err);
        throw err;
    }
};

module.exports = {
    unirseClase,
};

