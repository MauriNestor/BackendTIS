const DocenteService = require('../services/docenteService');

exports.registrarDocente = async (req, res) => {
    const { nombre, apellido, correo, contraseña } = req.body;
 
    try {
      const nuevoDocente = await DocenteService.createDocente({ nombre, apellido, correo, contraseña });
      res.status(201).json({
        mensaje: 'Docente registrado exitosamente',
        docente: nuevoDocente
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al registrar docente',
        detalle: error.message
      });
    }
  };

exports.obtenerDocentes = async (req, res) => {
    try {
        const docentes = await DocenteService.getAllDocentes();
        res.status(200).json(docentes);
    }
    catch (error) {
        res.status(500).json({
            error: 'Error al obtener los docentes',
            detalle: error.message
        });
    }
}