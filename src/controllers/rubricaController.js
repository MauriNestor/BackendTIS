const rubricaService = require('../services/rubricaService');

const getRubricasDeEvaluacion = async (req, res) => {
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

const registrarRubrica = async (req, res) => {
  const { codEvaluacion, nombreRubrica, descripcionRubrica, pesoRubrica, detallesRubrica } = req.body;
  // Verificación del rol del usuario
  if (req.user.role !== 'docente') {
    return res.status(403).json({ error: 'Acceso denegado' });
}

   try {
      if (!codEvaluacion || !nombreRubrica || !pesoRubrica) {
          return res.status(400).json({
              message: 'Datos incompletos. Asegúrate de proporcionar codEvaluacion, nombreRubrica y pesoRubrica.'
          });
      }

      const result = await rubricaService.registrarRubrica(
          codEvaluacion, 
          nombreRubrica, 
          descripcionRubrica, 
          pesoRubrica, 
          detallesRubrica || [] 
      );

      res.status(201).json({
          message: 'Rúbrica registrada exitosamente',
          data: result
      });
  } catch (err) {
      console.error('Error al registrar la rúbrica', err);
      res.status(500).json({
          message: 'Error al registrar la rúbrica',
          error: err.message
      });
  }
};

module.exports = {
    registrarRubrica,
    getRubricasDeEvaluacion,
};