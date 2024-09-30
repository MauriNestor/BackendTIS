const ClaseService = require('../services/claseService');

const generarCodigoClase = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

exports.crearClase = async (req, res) => {
  const { nombreClase, codGestion } = req.body;
  
  if(req.user.role !== 'docente'){
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  try {
      const codClase = generarCodigoClase();
      const codDocente = req.user.cod_docente;
      const nuevaClase = await ClaseService.crearClase(codDocente, codClase, codGestion, nombreClase);
      res.status(201).json({ mensaje: 'Clase creada exitosamente', clase: nuevaClase });
  }catch (error) {
    res.status(500).json({ error: 'Error al crear la clase', detalle: error.message });
  }
}