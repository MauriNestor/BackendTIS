const db = require('../config/db');
const pool = db.pool; 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const planificacionService = require('../services/planificacionService');
const DocenteService = require('../services/docenteService');

const unirseClase = async (token, codigoClase) => {
    try {
        const claseValida = await verificarClase(codigoClase);

        if (claseValida.existe) {
            const decoded = jwt.decode(token);
            if (!decoded || !decoded.codigoSis) {
                throw new Error('Token inválido o faltan datos en el token');
            }

            const codigoSis = decoded.codigoSis;
            const claseValidaEstudiante = await verificarClaseEstudiante(codigoClase, codigoSis);

            if (claseValidaEstudiante) {
                const codigoDocente = await planificacionService.getDocente(codigoClase);
                const query = 'INSERT INTO Clase_estudiante (cod_docente, cod_clase, codigo_sis) VALUES ($1, $2, $3) RETURNING *';
                const result = await db.pool.query(query, [codigoDocente, codigoClase, codigoSis]);

                // Obtener directamente la gestión
                const gestionResult = await getGestion(claseValida.clase.cod_gestion);
                const gestion = gestionResult[0]?.gestion; // Extraer directamente el valor de gestion

                const docente = await DocenteService.getDocente(codigoDocente);
                const nombreDocente = docente[0]?.nombre_docente;
                const apellidoDocente = docente[0]?.apellido_docente;

                // Asignar el valor de gestión y nombre del docente a la clase
                const clase = {
                    ...claseValida.clase,
                    gestion, // Reemplazar el array por el valor directo de gestión
                    docente: {
                        nombre: nombreDocente,
                        apellido: apellidoDocente
                    }
                };

                return { success: true, message: 'Estudiante registrado.', clase };
            } else {
                return { success: false, message: 'Ya se encuentra registrado en esta clase.' };
            }
        } else {
            return { success: false, message: 'No se encontró una clase con este código.' };
        }
    } catch (err) {
        console.error('Error al unirse a clase', err);
        throw err;
    }
};

const verificarClase = async (codigoClase) => {
    try {
        // Realizar la consulta para verificar la existencia de la clase
        const result = await pool.query(
            'SELECT * FROM Clase WHERE cod_clase = $1',
            [codigoClase]
        );

        // Acceder a los datos de la clase desde result.rows[0]
        const clase = result.rows[0];
        if (result.rowCount > 0) {
            return { existe: true, clase };
        } else {
            return { existe: false };
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

const obtenerClasesEstudiante = async (codigoSis) => {
    try {
        const result = await db.pool.query(
            'SELECT cod_clase FROM Clase_estudiante WHERE codigo_sis = $1',
            [codigoSis]
        );
        
        const codigosClase = result.rows;
        const clases = [];
        if (codigosClase.length === 0) {
            return { success: false, message: "No se encontraron clases del estudiante.", clases };
        }

        
        for (const codigoClase of codigosClase) {
            // Obtener los detalles de la clase
            const claseResult = await db.pool.query(
                'SELECT * FROM clase WHERE cod_clase = $1',
                [codigoClase.cod_clase]
            );
            
            // Extraer la clase
            const clase = claseResult.rows[0];

            // Obtener la gestión asociada a la clase
            const gestionResult = await getGestion(clase.cod_gestion);
            const gestion = gestionResult[0]?.gestion; // Extraer directamente el valor de gestion

            // Asignar el valor de gestion a la clase
            clase.gestion = gestion;

            // Obtener los datos del docente (nombre y apellido)
            const docenteResult = await DocenteService.getDocente(clase.cod_docente);
            const nombreDocente = docenteResult[0]?.nombre_docente;
            const apellidoDocente = docenteResult[0]?.apellido_docente;

            // Asignar el docente a la clase
            clase.docente = {
                nombre: nombreDocente,
                apellido: apellidoDocente
            };

            // Agregar la clase con la gestión y el docente a la lista de clases
            clases.push(clase);
        }

        return { success: true, clases };

    } catch (err) {
        console.error('Error al buscar clases del estudiante', err);
        throw err;
    }
};

const getGestion = async (codGestion) => {
    try {
        const result = await db.pool.query(
            'SELECT gestion FROM Gestion WHERE cod_gestion = $1',
            [codGestion]
        );
        
        const gestion = result.rows;

        return gestion;

    } catch (err) {
        console.error('Error al buscar la gestion', err);
        throw err;
    }
};

const getEstudiantesXClase = async (codigoClase) => {
    try {
        const result = await db.pool.query(
            ` SELECT 
            e.codigo_sis, 
            e.nombre_estudiante, 
            e.apellido_estudiante
        FROM 
            ESTUDIANTE e
        WHERE 
            e.codigo_sis IN (
                SELECT ce.codigo_sis 
                FROM CLASE_ESTUDIANTE ce
                WHERE ce.cod_clase = $1
            ) `,
            [codigoClase]
        );
        
        const estudiantes = result.rows;

        return estudiantes;

    } catch (err) {
        console.error('Error al buscar estudiantes', err);
        throw err;
    }
};

module.exports = {
    unirseClase,
    obtenerClasesEstudiante,
    getEstudiantesXClase
};

