const { obtenerDocente } = require('../services/loginService'); 
const { obtenerEstudiante } = require('../services/loginService'); 

const autenticarDocente = async (req, res) => {
    const { correo, password } = req.body;

    try {
        const docente = await obtenerDocente(correo, password);
        console.log("Autenticación exitosa.", docente)
        return res.status(200).json({
            message: 'Autenticación exitosa.',
            docente,
        });
    } catch (error) {
        console.error('Error al autenticar docente: Credenciales incorrectas o error interno.');
        return res.status(401).json({
            message: 'Credenciales incorrectas o error al autenticar.',
        });
    }
};

const autenticarEstudiante = async (req, res) => {
    const { codigoSis, password } = req.body;

    try {
        const estudiante = await obtenerEstudiante(codigoSis, password);
        console.log("Autenticación exitosa.", estudiante)
        return res.status(200).json({
            message: 'Autenticación exitosa.',
            estudiante,
        });
    } catch (error) {
        console.error('Error al autenticar Estudiante: Credenciales incorrectas o error interno.');
        return res.status(401).json({
            message: 'Credenciales incorrectas o error al autenticar.',
        });
    }
};

module.exports = {
    autenticarDocente,
    autenticarEstudiante,
};
