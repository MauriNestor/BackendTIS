const asistenciaService = require('../services/asistenciaService');

exports.registrarAsistencia = async (req, res) => {
    const { codClase } = req.params;
    const { listaAsistencia } = req.body;

    if (!codClase || !listaAsistencia || !Array.isArray(listaAsistencia)) {
        return res.status(400).json({ error: 'Código de clase y lista de asistencia válidos son requeridos' });
    }

    try {
        const asistenciaRegistrada = await asistenciaService.registrarAsistencia(codClase, listaAsistencia);
        
        res.status(200).json({
            message: 'Asistencia registrada correctamente',
            asistenciaRegistrada
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Error interno al registrar la asistencia',
            detalle: error.message
        });
    }
};

exports.generarReporte = async (req, res) => {
    const { codClase } = req.params;

    if (!codClase ) {
        return res.status(400).json({ error: 'Código de clase es requerido' });
    }

    try {
        const reporteAsistencia = await asistenciaService.generarReporte(codClase);
        
        res.status(200).json({
            reporteAsistencia
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Error interno al registrar la asistencia',
            detalle: error.message
        });
    }
};
