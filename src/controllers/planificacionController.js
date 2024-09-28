const planificacionService = require('../services/planificacionService');

// Registrar planificación (product backlog)
const registrarPlanificacion = async (req, res) => {
    const { codigoClase, codigoGrupo } = req.body;
    try {
        const result = await planificacionService.registrarPlanificacion(codigoClase, codigoGrupo);
        res.status(201).json({
            message: 'Planificación registrada exitosamente',
            result
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Registrar requerimientos
const registrarRequerimientos = async (req, res) => {
    const { codigoProduct, requerimientos } = req.body;
    try {
        await planificacionService.registrarRequerimientos(codigoProduct, requerimientos);
        res.status(201).json({
            message: 'Requerimientos registrados exitosamente'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Registrar sprint
const registrarSprint = async (req, res) => {
    try {
        const { codigoProduct, sprint, fechaInicio, fechaFin, objetivo, requerimientos } = req.body;
        const result = await planificacionService.registrarSprint(Number(codigoProduct), Number(sprint), fechaInicio, fechaFin, objetivo, requerimientos);
        res.status(201).json({
            message: 'Sprint registrado exitosamente'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    registrarPlanificacion,
    registrarRequerimientos,
    registrarSprint,
};
