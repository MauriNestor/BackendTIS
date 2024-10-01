const resetPasswordService = require('../services/resetPasswordService');

const resetPassword = async (req, res) => {
    const { newPassword, token } = req.body;

    try {
        // Llamada al servicio de restablecer contraseña
        const result = await resetPasswordService.restablecerPassword(newPassword, token);

        // Verificar el resultado del servicio
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: result.message,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: result.message,
            });
        }
    } catch (err) {
        console.error('Error en el restablecimiento de contraseña', err);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

module.exports = {
    resetPassword,
};
