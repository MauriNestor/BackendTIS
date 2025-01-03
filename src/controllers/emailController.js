const emailService = require('../services/emailService');

const enviarCorreoRestablecer = async (req, res) => {
    const { correo, rol } = req.body; // Obtener los datos del cuerpo de la solicitud

    try {
        // Validar que se recibieron los datos necesarios
        if (!correo || !rol) {
            return res.status(400).json({ error: 'Correo y rol son obligatorios.' });
        }

        // Llamar al servicio para enviar el correo
        const result = await emailService.enviarCorreoRestablecer(correo, rol);
        
        // Verificar si el correo fue encontrado y enviado
        if (result.success) {
            return res.status(200).json({ message: 'Correo de restablecimiento enviado exitosamente.' });
        } else {
            return res.status(404).json({ error: result.message }); // Error si el correo no fue encontrado
        }

    } catch (err) {
        // Manejar errores
        console.error('Error al enviar el correo de restablecimiento', err);
        return res.status(500).json({ error: 'Error interno del servidor al enviar el correo.' });
    }
};

module.exports = {
    enviarCorreoRestablecer,
};
