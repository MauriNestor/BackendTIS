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
            return res.status(200).json({ message: result.message });
        } else {
            return res.status(400).json({ error: result.message });
        }

    } catch (err) {
        // Manejo de errores del servidor
        console.error('Error al unirse a la clase', err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

module.exports = {
    unirseClase,
};
