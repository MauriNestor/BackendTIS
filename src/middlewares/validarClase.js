const claseSchema = require('../schemas/claseSchema');

const validarClase = (req, res, next) => {
  try {
    claseSchema.parse(req.body);
    next(); 
  } catch (error) {
    res.status(400).json({ error: 'Datos inválidos', detalle: error.errors });
  }
};

module.exports = validarClase;
