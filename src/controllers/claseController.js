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
};
exports.obtenerClasesPorDocente = async (req, res) => {
  if(req.user.role !== 'docente'){
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  try {
    const codDocente = req.user.cod_docente;
    const clases = await ClaseService.obtenerClasesPorDocente(codDocente);
    res.status(200).json({ clases });
  } catch (error) {
    console.error('Error al obtener las clases del docente:', error);
    res.status(500).json({ error: 'Error al obtener las clases del docente', detalle: error.message });
  }
};
exports.obtenerHorarioDisponible = async (req, res) => {
  try {
    const { codClase } = req.params; // Verifica que este valor esté definido
    if (!codClase) {
      return res.status(400).json({ error: "El parámetro 'codClase' es obligatorio." });
    }
    
    const horarios = await ClaseService.obtenerHorarioDisponible(codClase);
    res.status(200).json({ horarios });
  } catch (error) {
    console.error('Error al obtener los horarios de clase:', error);
    res.status(500).json({ error: 'Error al obtener los horarios de clase', detalle: error.message });
  }
};


