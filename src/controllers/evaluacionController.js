const evaluacionesService = require('../services/evaluacionService');
const fs = require('fs');
const { pool } = require('../config/db');


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
    const { codClase, tema, nombreEvaluacion, tipoEvaluacion, fechaEntrega, archivo, descripcion, codigosGrupos } = req.body;

    let archivoBuffer = null;

    // Verificación del rol del usuario
    if (req.user.role !== 'docente') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    try {
        if (archivo) { 
            archivoBuffer = Buffer.from(archivo, 'base64');  
        }

        const descripcionEvaluacion = descripcion || '';  

        const evaluacion = await evaluacionesService.registrarEvaluacion(
            codClase, tema, nombreEvaluacion, tipoEvaluacion, fechaEntrega, archivoBuffer, descripcionEvaluacion, codigosGrupos
        );

        // Responder con la evaluación registrada
        res.status(200).json(evaluacion);

    } catch (error) {
        console.error('Error al registrar la evaluación:', error);
        res.status(500).json({ error: 'Error al registrar la evaluación.' });
    }
};


exports.obtenerEstadoEntregas = async (req, res) => {
    const { codEvaluacion } = req.params;
    const codDocente = req.user.cod_docente; 
    if (!codEvaluacion || isNaN(codEvaluacion) || parseInt(codEvaluacion) <= 0) {
      return res.status(400).json({ error: 'El código de evaluación es inválido' });
    }
  
    try {
        const estadoEntregas = await evaluacionesService.obtenerEstadoEntregas(codDocente, parseInt(codEvaluacion));
        res.status(200).json(estadoEntregas);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener el estado de las entregas',
            detalle: error.message,
        });
    }
};

exports.subirEntregable = async (req, res) => {
    const { codGrupo } = req.params;
    const {cod_evaluacion, cod_horario, observaciones_entregable, archivo_grupo, cod_clase} = req.body;
    const codDocente = req.user.cod_docente;

    if (!cod_evaluacion || !cod_horario || !archivo_grupo || !cod_clase) {
        return res.status(400).json({ error: 'falta informacion necesaria' });
    }
    try {
        const result = await evaluacionesService.subirEntregable(
            cod_horario, 
            cod_evaluacion, 
            codDocente, 
            observaciones_entregable, 
            cod_clase, 
            archivo_grupo, 
            codGrupo
        );
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({
            error: 'Error al subir el entregable',
            detalle: error.message,
        });
    }
};
