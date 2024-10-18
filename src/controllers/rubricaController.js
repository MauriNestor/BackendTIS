const rubricaService = require('../services/rubricaService');

exports.getRubricasDeEvaluacion = async (req, res) => {
    const { codEvaluacion } = req.params;
  
    // Validar que codEvaluacion sea un número entero válido
    if (!codEvaluacion || isNaN(codEvaluacion) || parseInt(codEvaluacion) <= 0) {
      return res.status(400).json({ error: 'El código de evaluación debe ser un número válido' });
    }
  
    try {
        const rubricas = await rubricaService.getRubricasByEvaluacion(parseInt(codEvaluacion));
        res.status(200).json(rubricas);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Error al obtener las rúbricas de la evaluación',
        detalle: error.message,
      });
    }
  };