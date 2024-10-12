const evaluacionesService = require('../services/evaluacionService');

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
