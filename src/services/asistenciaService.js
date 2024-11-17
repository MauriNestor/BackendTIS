const { pool } = require('../config/db');
const claseEtudianteService = require('../services/claseEstudianteService');
const claseService = require('../services/claseService');
const grupoEmpresaService = require('../services/grupoEmpresaService');


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

const generarReporte = async (codClase, codGrupo) => {
    try {
        
        const grupoEmpresa = await grupoEmpresaService.getGrupoEmpresa(codGrupo);
        if (!grupoEmpresa) {
            throw new Error(`No se pudo obtener información del grupo empresa para el código: ${codGrupo}`);
        }
        const grupo = grupoEmpresa.nombre_corto;
        const horario = grupoEmpresa.horario;
        const estudiantes = grupoEmpresa.integrantes;
        const nombreClase = await claseService.getNombreClase(codClase); 
        let estudiantesConAsistencia = [];

        for (const estudiante of estudiantes) {
            const asistenciaResult = await pool.query(
                `SELECT fecha_asistencia, tipo_asistencia FROM asistencia 
                 WHERE codigo_sis = $1;`,
                [estudiante.codigo_sis]
            );

            // Contador para los tipos de asistencia
            const contadorAsistencia = {
                Presente: 0,
                Retraso: 0,
                "Ausente sin Justificación": 0,
                "Ausente con Justificación": 0,
            };

            // Procesar cada registro de asistencia
            const asistencia = asistenciaResult.rows.map(registro => {
                const estado = registro.tipo_asistencia;

                // Incrementar el contador correspondiente
                if (contadorAsistencia[estado] !== undefined) {
                    contadorAsistencia[estado]++;
                }

                return {
                    fecha: new Date(registro.fecha_asistencia).toLocaleDateString('en-CA'),  // Formato "YYYY-MM-DD"
                    estadoAsistencia: estado
                };
            });

            // Incrementar Ausente sin Justificación por cada 3 Retrasos
            if (contadorAsistencia.Retraso >= 3) {
                contadorAsistencia["Ausente sin Justificación"] += Math.floor(contadorAsistencia.Retraso / 3);
                contadorAsistencia.Retraso %= 3; // Ajustar el contador de Retrasos
            }

            // Determinar si el estudiante ha abandonado
            const abandono = contadorAsistencia["Ausente sin Justificación"] >= 3 ? "Abandono" : null;

            estudiantesConAsistencia.push({
                ...estudiante,
                asistencia: asistencia,
                resumenAsistencia: contadorAsistencia,
                estado: abandono // Agregar el estado de abandono si corresponde
            });
        }

        return { nombreClase, grupo, horario, estudiantesConAsistencia };
        
    } catch (err) {
        console.error('Error al generar el reporte de asistencia', err);
        throw err;
    }
};


module.exports = {
    registrarAsistencia,
    generarReporte,
};