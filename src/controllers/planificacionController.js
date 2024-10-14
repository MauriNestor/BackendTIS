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
    const { codigoGrupo, requerimientos } = req.body;
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

const obtenerSprint = async (req, res) => {
    const { codigoGrupo } = req.params; 

    try {
        const sprintsConRequerimientos = await planificacionService.obtenerSprint(codigoGrupo);

        if (!sprintsConRequerimientos || sprintsConRequerimientos.length === 0) {
            return res.status(200).json([]); // Devuelve un arreglo vacío si no hay sprints
        }

        // Devolver los sprints con sus requerimientos en la respuesta
        res.status(200).json(sprintsConRequerimientos);

    } catch (error) {
        console.error('Error al obtener sprintbacklog:', error);
        res.status(500).json({ error: 'Error al obtener sprintbacklog.' });
    }
};

const obtenerProductBacklog = async (req, res) => {
    const { codigoGrupo } = req.params;
    
    try {
        const backlog = await planificacionService.obtenerProductBacklog(codigoGrupo);
        if (!backlog || backlog.length === 0) {
            return res.status(200).json([]); // Devuelve un arreglo vacío si no hay requerimientos
        }
        return res.status(200).json(backlog);
    } catch (err) {
        console.error('Error al obtener product backlog', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    registrarPlanificacion,
    registrarRequerimientos,
    registrarSprint,
    obtenerSprint,
    obtenerProductBacklog,
};
