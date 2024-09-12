exports.registrarDocente = (req, res) => {
    const { nombre, apellido, correo, contraseña } = req.body;

    res.status(201).json({
        mensaje: "Docente registrado exitosamente",
        docente: {
            nombre,
            apellido,
            correo,
            contraseña 
        }
    });
};

exports.obtenerDocentes = (req, res) => {
    const docentes = [
      { id: 1, nombre: 'Juan', apellido: 'Perez', correo: 'juan.perez@umss.edu.bo' },
      { id: 2, nombre: 'Maria', apellido: 'Garcia', correo: 'maria.garcia@umss.edu.bo' },
      { id: 3, nombre: 'Carlos', apellido: 'Lopez', correo: 'carlos.lopez@umss.edu.bo' }
    ];

    res.status(200).json(docentes);
  };