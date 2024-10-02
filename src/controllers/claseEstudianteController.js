const claseEstudianteService = require('../services/claseEstudianteService');

const unirseClase = async (req, res) => {
    const { token, codigoClase } = req.body; // Obtener datos del cuerpo de la solicitud

    try {
        // Validar que se recibieron los datos necesarios
        if (!token || !codigoClase) {
            return res.status(400).json({ error: 'Token y código de clase son obligatorios.' });
        }

        // Llamar al servicio para procesar la unión a la clase
        const result = await claseEstudianteService.unirseClase(token, codigoClase);

        // Verificar el resultado del servicio y devolver la respuesta adecuada
        if (result.success) {
            return res.status(200).json({  clase: result.clase});
        } else {
            return res.status(400).json({ error: result.message });
        }

    } catch (err) {
        // Manejo de errores del servidor
        console.error('Error al unirse a la clase', err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

const obtenerClasesEstudiante = async (req, res) => {
    const { codigoSis } = req.query; // Obtener el codigoSis de los query params

    try {
        // Validar que el codigoSis fue recibido
        if (!codigoSis) {
            return res.status(400).json({ error: 'El código SIS es obligatorio.' });
        }

        // Llamar al servicio para obtener las clases del estudiante
        const result = await claseEstudianteService.obtenerClasesEstudiante(codigoSis);

        // Verificar si se encontraron clases
        if (result.clases && result.clases.length > 0) {
            return res.status(200).json({ clases: result.clases });
        } else {
            return res.status(404).json({ message: result.message || 'No se encontraron clases para este estudiante.' });
        }
    } catch (err) {
        // Manejo de errores del servidor
        console.error('Error al obtener las clases del estudiante', err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

module.exports = {
    unirseClase,
    obtenerClasesEstudiante
};
