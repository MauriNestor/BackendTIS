const horarioService = require('../services/horarioService');

exports.registrarHorario = async (req, res) => {
    const { codClase } = req.params;
    const { hora_inicio, hora_fin, dia_horario } = req.body;
    const { cod_docente, role } = req.user;

    console.log(`Controlador - codClase: ${codClase}, cod_docente: ${cod_docente}`);

    if (role !== 'docente') {
        return res.status(401).json({ error: 'No autorizado' });
    }

    try {
        const horario = await horarioService.postHorario({
            codClase,
            cod_docente,
            hora_inicio,
            hora_fin,
            dia_horario
        });

        res.status(201).json({ message: 'Horario registrado exitosamente', horario });
    } catch (error) {
        if (error.message === 'Ya existe un horario en el mismo día y hora') {
            return res.status(409).json({ error: error.message });
        }

        console.error('Error al registrar el horario:', error);
        res.status(500).json({
            error: 'Error al registrar el horario',
            detalle: error.message
        });
    }
};
