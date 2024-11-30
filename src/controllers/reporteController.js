const reporteService = require('../services/reporteService');

exports.generarReporteNotasPorGrupo = async (req, res) => {
    const { codigoGrupo } = req.params;

    try {
        const reporte = await reporteService.generarReporteNotasPorGrupo(codigoGrupo);

        res.status(200).json(reporte);
    } catch (error) {
        console.error('Error al generar el reporte de notas por grupo:', error);
        res.status(500).json({ message: 'Error al generar el reporte de notas por grupo.', detalle: error.message });
    }
};
