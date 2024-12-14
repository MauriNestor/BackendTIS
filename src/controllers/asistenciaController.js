const asistenciaService = require('../services/asistenciaService');

exports.registrarAsistencia = async (req, res) => {
    const { codClase } = req.params;
    const { listaAsistencia, fecha } = req.body;

    if (!codClase || !listaAsistencia || !Array.isArray(listaAsistencia)) {
        return res.status(400).json({ error: 'Código de clase y lista de asistencia válidos son requeridos' });
    }

    try {
        const asistenciaRegistrada = await asistenciaService.registrarAsistencia(codClase, fecha, listaAsistencia);
        
        res.status(200).json({
            message: 'Asistencia registrada correctamente'
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Error interno al registrar la asistencia',
            detalle: error.message
        });
    }
};

exports.generarReporte = async (req, res) => {
    const { codClase, codGrupo } = req.params;

    if (!codClase || !codGrupo) {
        return res.status(400).json({ error: 'Código de clase y codGrupo es requerido' });
    }

    try {
        
        const { nombreClase, grupo, horario, estudiantesConAsistencia } = await asistenciaService.generarReporte(codClase, codGrupo);

        res.status(200).json({
            nombreClase, 
            grupo,
            horario,
            reporteAsistencia: estudiantesConAsistencia 
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error interno al generar el reporte de asistencia',
            detalle: error.message
        });
    }
};

exports.obtenerAsistencia = async (req, res) => {
    try {
        const { codGrupo, fecha } = req.query;

        // Validar que ambos parámetros están presentes
        if (!codGrupo || !fecha) {
            return res.status(400).json({ message: "codGrupo y fecha son obligatorios" });
        }

        // Llamar al servicio para obtener la asistencia
        const asistencia = await asistenciaService.obtenerAsistencia(codGrupo, fecha);

        // Formatear las fechas de la asistencia
        const asistenciaFormateada = asistencia.map(item => ({
            ...item,
            fecha_asistencia: new Date(item.fecha_asistencia).toISOString().split('T')[0] // Formato "YYYY-MM-DD"
        }));

        // Retornar la asistencia obtenida
        return res.status(200).json({
            message: "Asistencia obtenida exitosamente",
            data: asistenciaFormateada
        });
    } catch (err) {
        console.error("Error en el controlador obtenerAsistencia:", err);
        return res.status(500).json({
            message: "Error al obtener la asistencia",
            error: err.message
        });
    }
};
