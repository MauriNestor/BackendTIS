const claseSchema = require('../schemas/claseSchema');

const validarClase = (req, res, next) => {
  try {
    // Validar los datos de la solicitud con Zod
    claseSchema.parse(req.body);
    next(); // Continuar si la validación fue exitosa
  } catch (error) {
    res.status(400).json({ error: 'Datos inválidos', detalle: error.errors });
  }
};

module.exports = validarClase;
