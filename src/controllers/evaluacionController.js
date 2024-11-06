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

//mover desde aqui hasta el final a un nuevo controlador de entregables
exports.subirEntregable = async (req, res) => {
    const { codEvaluacion } = req.params;
    const archivo_grupo = req.body.archivo_grupo;
    const codigo_sis = req.user.codigoSis;  
    console.log('codigo_sis del estudiante:', codigo_sis);

    if (!archivo_grupo) {
        return res.status(400).json({ error: 'El archivo del grupo no está presente' });
    }

    try {
        const result = await evaluacionesService.subirEntregable(
            codEvaluacion,
            archivo_grupo,
            codigo_sis
        );
        
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({
            error: 'Error al subir el entregable',
            detalle: error.message,
        });
    }
};

exports.obtenerEntregablePorEvaluacion = async (req, res) => {
    const { codEvaluacion } = req.params;
    const codigo_sis = req.user.codigoSis;  

    try {
        const archivoBuffer = await evaluacionesService.obtenerEntregablePorEvaluacionYGrupo(codEvaluacion, codigo_sis);

        if (archivoBuffer) {
            const archivoBase64 = archivoBuffer.toString('base64');
            res.status(200).json({ archivo: archivoBase64 });
        } else {
            res.status(404).json({ message: 'No se ha subido ningún entregable para esta evaluación' });
        }
    } catch (error) {
        console.error('Error al obtener el entregable:', error);
        res.status(500).json({ error: 'Error al obtener el entregable', detalle: error.message });
    }
};

exports.getTipoEvaluacion = async (req, res) => {
    const { codEvaluacion } = req.params;

    try {
        const result = await evaluacionesService.getTipoEvaluacion(codEvaluacion);

        res.status(201).json(result);
    } catch (error) {
        console.error('Error al obtener el tipo de evaluacion:', error);
        res.status(500).json({ error: 'Error al obtener el tipo de evaluacion', detalle: error.message });
    }
};