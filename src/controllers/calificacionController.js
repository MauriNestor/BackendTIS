// controllers/calificacionController.js
const { calificarEstudiante } = require('../services/calificacionService');
const { retroalimentar } = require('../services/calificacionService');

const calificarEstudianteController = async (req, res) => {
    const { codEvaluacion, codigoSis, notas, comentario } = req.body;
    try {
        const resultado = await calificarEstudiante(codEvaluacion, codigoSis, notas, comentario);
        
        if (resultado) {
            res.status(201).json({ message: 'Calificación y comentario registrados exitosamente' });
        } else {
            res.status(400).json({ message: 'No se pudo registrar la calificación' });
        }
    } catch (error) {
        console.error('Error en calificarEstudianteController:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const retroalimentarController = async (req, res) => {
    const { codEvaluacion, codClase, codGrupo, comentario } = req.body;
    
    try {
        const codRetroalimentacion = await retroalimentar(codEvaluacion, codClase, codGrupo, comentario);
        
        if (codRetroalimentacion) {
            res.status(201).json({ 
                message: 'Retroalimentación registrada exitosamente', 
                cod_retroalimentacion: codRetroalimentacion 
            });
        } else {
            res.status(400).json({ message: 'No se pudo registrar la retroalimentación' });
        }
    } catch (error) {
        console.error('Error en retroalimentarController:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    calificarEstudianteController,
    retroalimentarController,
};
