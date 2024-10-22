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
    const { codEvaluacion, rubricas } = req.body;
  
    // Verificación del rol del usuario
    if (req.user.role !== 'docente') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
  
    try {
      // Verificación básica de los datos requeridos
      if (!codEvaluacion || !rubricas || rubricas.length === 0) {
        return res.status(400).json({
          message: 'Datos incompletos. Asegúrate de proporcionar codEvaluacion y al menos una rúbrica.'
        });
      }
  
      // Itera sobre las rúbricas en el cuerpo de la solicitud y verifica que cada rúbrica esté completa
      for (const rubrica of rubricas) {
        if (!rubrica.nombreRubrica || !rubrica.pesoRubrica) {
          return res.status(400).json({
            message: 'Cada rúbrica debe tener al menos nombre y peso definidos.'
          });
        }
      }
  
      // Llamar al servicio para registrar las rúbricas
      await rubricaService.registrarRubrica(codEvaluacion, rubricas);
  
      res.status(201).json({
        message: 'Rúbricas registradas exitosamente',
      });
    } catch (err) {
      console.error('Error al registrar las rúbricas', err);
      res.status(500).json({
        message: 'Error al registrar las rúbricas',
        error: err.message
      });
    }
  };
  

module.exports = {
    registrarRubrica,
    getRubricasDeEvaluacion,
};