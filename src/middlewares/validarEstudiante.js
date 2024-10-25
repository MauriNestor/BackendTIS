const estudianteSchema = require('../schemas/estudianteSchema');  // Importar el esquema desde la carpeta schemas

const validarEsquemaEstudiante = (req, res, next) => {
  try {
    estudianteSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }
};

module.exports = validarEsquemaEstudiante;
