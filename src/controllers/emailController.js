const emailService = require('../services/emailService');

const enviarCorreoRestablecer = async (req, res) => {
    const { correo, rol } = req.body; // Obtener los datos del cuerpo de la solicitud

    try {
        // Validar que se recibieron los datos necesarios
        if (!correo || !rol) {
            return res.status(400).json({ error: 'Correo y rol son obligatorios.' });
        }

        // Llamar al servicio para enviar el correo
        await emailService.enviarCorreoRestablecer(correo, rol);
        
        // Responder en caso de éxito
        return res.status(200).json({ message: 'Correo de restablecimiento enviado exitosamente.' });
    } catch (err) {
        // Manejar errores
        console.error('Error al enviar el correo de restablecimiento', err);
        return res.status(500).json({ error: 'Error interno del servidor al enviar el correo.' });
    }
};

module.exports = {
    enviarCorreoRestablecer,
};