const rubricaService = require('../services/rubricaService');

  const obtenerRubricasConDetalles = async (req, res) => {
    const { codEvaluacion, codGrupo } = req.params;
    try {
      if (!codEvaluacion || !codGrupo) {
        return res.status(400).json({
          message: 'Datos incompletos. Asegúrate de proporcionar codEvaluacion y codGrupo.'
        });
      }
  
      const rubricas = await rubricaService.obtenerRubricasConDetalles(codEvaluacion, codGrupo);
  
      res.status(200).json(rubricas);
    } catch {
      console.error('Error al obtener las rúbricas con detalles', err);
      res.status(500).json({
        message: 'Error al obtener las rúbricas con detalles',
        detalle: error.message,
      });
    }
  }

  const obtenerCalificacionesPorEvaluacionYGrupo = async (req, res) => {
    const { codEvaluacion, codGrupo } = req.params;

    try {
        if (!codEvaluacion || !codGrupo) {
            return res.status(400).json({
                message: 'Datos incompletos. Asegúrate de proporcionar codEvaluacion y codGrupo.'
            });
        }
        const estudiantesConCalificaciones = await rubricaService.obtenerRubricasConCalificaciones(codEvaluacion, codGrupo);

        res.status(200).json(estudiantesConCalificaciones);
    } catch (error) {
        console.error('Error al obtener las calificaciones por evaluación y grupo:', error);
        res.status(500).json({
            message: 'Error al obtener las calificaciones por evaluación y grupo',
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
      if (!codEvaluacion || !rubricas || rubricas.length === 0 ) {
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

  const editarRubrica = async (req, res) => {
    const { codEvaluacion, rubricas, codClase } = req.body;

    if (!codEvaluacion || !rubricas || !codClase) {
        return res.status(400).json({ message: 'Faltan parámetros obligatorios.' });
    }

    try {
        await rubricaService.editarRubrica(codEvaluacion, rubricas, codClase);
        res.status(200).json({ message: 'Rúbricas actualizadas correctamente.' });
    } catch (err) {
        console.error('Error en el controlador editarRubrica:', err);
        res.status(500).json({ message: 'Error al actualizar las rúbricas.', error: err.message });
    }
};

const obtenerRubrica = async (req, res) => {
  try {
      const { codEvaluacion } = req.params;

      if (!codEvaluacion) {
          return res.status(400).json({ message: 'El código de evaluación es requerido.' });
      }

      const rubrica = await rubricaService.obtenerRubrica(codEvaluacion);

      return res.status(200).json({
          message: 'Rúbrica obtenida exitosamente.',
          rubrica,
      });
  } catch (err) {
      console.error('Error en el controlador obtenerRubrica:', err);
      return res.status(500).json({
          message: 'Error al obtener la rúbrica.',
          error: err.message,
      });
  }
};  

const obtenerNotaTotal = async (req, res) => {
  const { codClase } = req.params; // Obtener el código de clase desde los parámetros

  try {
      const notaTotal = await rubricaService.getNotaTotal(codClase);
      res.status(200).json({
          success: true,
          notaTotal
      });
  } catch (err) {
      console.error('Error en el controlador al obtener la nota total:', err);
      res.status(500).json({
          success: false,
          message: 'Hubo un error al obtener la nota total.',
          error: err.message
      });
  }
};

module.exports = {
    registrarRubrica,
    obtenerRubricasConDetalles,
    obtenerCalificacionesPorEvaluacionYGrupo,
    editarRubrica,
    obtenerRubrica,
    obtenerNotaTotal,
};