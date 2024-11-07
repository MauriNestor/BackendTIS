const evaluacionCruzadaService = require('../services/evaluacionCruzadaService');

exports.getGrupoAEvaluar = async (req, res) => {
    const { codClase } = req.params;
    if (!codClase) {
        return res.status(400).json({ error: 'El código de clase es requerido' });
      }
    try {
        console.log(req.user);
        const codigoSis = req.user.codigoSis; 
        console.log(codigoSis);
        const grupoAEvaluar = await evaluacionCruzadaService.getGrupoAEvaluar(codigoSis,codClase);

        res.status(200).json(grupoAEvaluar);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener el grupo a evaluar',
            detalle: error.message
        });
    }
};