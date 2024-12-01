const evaluacionesService = require('../services/evaluacionService');
const fs = require('fs');
const { pool } = require('../config/db');


exports.getEvaluacionesByClass = async (req, res) => {
    const { cod_clase } = req.params;
    const { role, codigoSis } = req.user;

    try {
        let evaluaciones;
        
        if (role === 'docente') {
            evaluaciones = await evaluacionesService.getEvaluacionesByClass(cod_clase);
        } else if (role === 'estudiante') {
            evaluaciones = await evaluacionesService.getEvaluacionesByClassForStudent(cod_clase, codigoSis);
        }

        if (!evaluaciones || evaluaciones.length === 0) {
            return res.status(404).json({
                error: 'No se encontraron evaluaciones'
            });
        }

        res.status(200).json(evaluaciones);
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
    const { archivo_grupo, link_entregable } = req.body;
    const codigo_sis = req.user.codigoSis;  
    console.log('codigo_sis del estudiante:', codigo_sis);
    console.log('codEvaluacion:', codEvaluacion);

    if (!archivo_grupo) {
        return res.status(400).json({ error: 'El archivo del grupo no está presente' });
    }

    try {
        const result = await evaluacionesService.subirEntregable(
            codEvaluacion,
            archivo_grupo,
            link_entregable,
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
        const { archivoBuffer, linkEntregable } = await evaluacionesService.getListaGruposEntregaronEvaluacion(codEvaluacion, codigo_sis);

        if (archivoBuffer || linkEntregable) {
            const respuesta = {};
            
            if (archivoBuffer) {
                respuesta.archivo = archivoBuffer.toString('base64');
            }

            if (linkEntregable) {
                respuesta.link_entregable = linkEntregable;
            }

            return res.status(200).json(respuesta);
        } else {
            return res.status(204).json({ message: 'No se ha subido ningún entregable para esta evaluación' });
        }
    }catch (error) {
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

exports.obtenerNotasDetalladasEstudiante = async (req, res) => {
    const { codEvaluacion, codClase } = req.params;
    const codigo_sis = req.user.codigoSis;
    const role = req.user.role;

    try {
        let notasDetalladas;

        if (role === 'estudiante') {
            notasDetalladas = await evaluacionesService.obtenerNotasDetalladasEstudiante(codEvaluacion, codigo_sis, codClase);
        } else if (role === 'docente') {
            notasDetalladas = await evaluacionesService.obtenerRubricasYDetallesDocente(codEvaluacion);
        } else {
            return res.status(403).json({ message: 'No tiene permiso para ver estas notas.' });
        }

        res.status(200).json(notasDetalladas);
    } catch (error) {
        console.error('Error al obtener la nota total del estudiante:', error);
        res.status(500).json({
            message: 'Error al obtener la nota total del estudiante',
            detalle: error.message,
        });
    }
};

exports.eliminarEvaluacion = async (req, res) => {
    const { codEvaluacion } = req.params;
    try {
        const result = await evaluacionesService.eliminarEvaluacion(codEvaluacion);
        
        if (result.error) {
            return res.status(result.status).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al eliminar la evaluación:', error);
        res.status(500).json({ error: 'Error al eliminar la evaluación', detalle: error.message });
    }
}

exports.obtenerArchivosEntregadosDocente = async (req, res) => {
    const { codEvaluacion, codGrupo } = req.params;
    const role = req.user.role;

    try {
        const { archivoBuffer, linkEntregable }= await evaluacionesService.obtenerArchivosEntregadosDocente(codEvaluacion, codGrupo, role);

        if (archivoBuffer || linkEntregable) {
            const respuesta = {};
            
            if (archivoBuffer) {
                respuesta.archivo = archivoBuffer.toString('base64');
            }

            if (linkEntregable) {
                respuesta.link_entregable = linkEntregable;
            }

            return res.status(200).json(respuesta);
        } else {
            return res.status(204).json({ message: 'No se ha subido ningún entregable para esta evaluación' });
        }    
    } catch (error) {
        console.error('Error al obtener los archivos entregados:', error);
        res.status(500).json({ error: 'Error al obtener los archivos entregados', detalle: error.message });
    }
}