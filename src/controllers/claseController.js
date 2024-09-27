const ClaseService = require('../services/claseService');

exports.crearClase = async (req, res) => {
  const { cod_clase, cod_gestion, codigo, nombre_clase } = req.body;
  const cod_docente = req.docenteId; 

  if (!cod_docente) {
    return res.status(400).json({ error: 'El ID del docente es obligatorio' });
  }

  try {
    const nuevaClase = await ClaseService.crearClase({ cod_docente, cod_clase, cod_gestion, codigo, nombre_clase });
    res.status(201).json({
      mensaje: 'Clase creada exitosamente',
      clase: nuevaClase
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al crear la clase',
      detalle: error.message
    });
  }
};
