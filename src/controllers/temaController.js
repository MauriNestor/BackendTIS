const temaService = require('../services/temaService');

const getTema = async (req, res) => {
    const { codigoClase } = req.params; 

    try {
        const temas = await temaService.getTema(codigoClase);
        res.status(200).json(temas);

    } catch (error) {
        console.error('Error al obtener temas:', error);
        res.status(500).json({ error: 'Error al obtener temas.' });
    }
};

module.exports = {
    getTema,
};
