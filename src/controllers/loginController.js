const { obtenerDocente } = require('../services/loginService'); 

const autenticarDocente = async (req, res) => {
    const { correo, password } = req.body;

    try {
        const docente = await obtenerDocente(correo, password);
        return res.status(200).json({
            message: 'Autenticación exitosa.',
            docente,
        });
    } catch (error) {
        console.error('Error al autenticar docente:', error);
        return res.status(401).json({
            message: 'Credenciales incorrectas o error al autenticar.',
        });
    }
};

module.exports = {
    autenticarDocente,
};
