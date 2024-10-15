const evaluacionesService = require('../services/evaluacionService');
const fs = require('fs');

exports.getEvaluacionesByClass = async (req, res) => {
    const { cod_clase } = req.params;
    if (!cod_clase) {
        return res.status(400).json({ error: 'El código de clase es requerido' });
      }
    try {
        const evaluacionesPorTema = await evaluacionesService.getEvaluacionesByClass(cod_clase);
        // console.log('Evaluaciones:', evaluaciones); // Agrega este log para depurar
        res.status(200).json(evaluacionesPorTema);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener las evaluaciones',
            detalle: error.message
        });
    }
};
exports.getEvaluacionById = async (req, res) => {
    const { cod_evaluacion } = req.params;
    try {
        const evaluacion = await evaluacionesService.getEvaluacionById(cod_evaluacion);

        if (!evaluacion) {
            return res.status(404).json({
                error: 'Evaluación no encontrada'
            });
        }
        res.status(200).json(evaluacion);
    }catch (error) {
        res.status(500).json({
            error: 'Error al obtener la evaluación',
            detalle: error.message
        });
    }
};

exports.registrarEvaluacion = async (req, res) => {
    const { codClase, tema, nombreEvaluacion, tipoEvaluacion, fechaEntrega, archivo, descripcion } = req.body;

    let archivoBuffer = null;
    if(req.user.role !== 'docente'){
        return res.status(403).json({ error: 'Acceso denegado' });
    }

    try {
        // Si el archivo está presente en formato base64, conviértelo a buffer
        if (archivo) { 
            archivoBuffer = Buffer.from(archivo, 'base64');  // Decodificar base64 a buffer
        }

        const descripcionEvaluacion = descripcion || '';  // Si la descripción no está presente, se asigna un string vacío

        // Llamada al método del servicio para registrar la evaluación
        const evaluacion = await evaluacionService.registrarEvaluacion(
            codClase, tema, nombreEvaluacion, tipoEvaluacion, fechaEntrega, archivoBuffer, descripcionEvaluacion
        );

        // Responder con la evaluación registrada
        res.status(200).json(evaluacion);
    } catch (error) {
        console.error('Error al registrar la evaluación:', error);
        res.status(500).json({ error: 'Error al registrar la evaluación.' });
    }
};
