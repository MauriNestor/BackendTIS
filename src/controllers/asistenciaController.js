const asistenciaService = require('../services/asistenciaService');

exports.registrarAsistencia = async (req, res) => {
    const { codClase } = req.params;
    const { listaAsistencia } = req.body;

    if (!codClase || !listaAsistencia || !Array.isArray(listaAsistencia)) {
        return res.status(400).json({ error: 'Código de clase y lista de asistencia válidos son requeridos' });
    }

    try {
        const result = await asistenciaService.registrarAsistencia(codClase, listaAsistencia);
        if (result) {
            res.status(200).json({ message: 'Asistencia registrada correctamente' });
        } else {
            res.status(500).json({ error: 'Error al registrar la asistencia' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Error interno al registrar la asistencia',
            detalle: error.message
        });
    }
};
