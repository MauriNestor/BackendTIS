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
    const { sprint, fechaInicio, fechaFin, objetivo, requerimientos } = req.body;
    try {
        await planificacionService.registrarSprint(sprint, fechaInicio, fechaFin, objetivo, requerimientos);
        res.status(201).json({
            message: 'Sprint registrado exitosamente'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    registrarPlanificacion,
    registrarRequerimientos,
    registrarSprint,
};
