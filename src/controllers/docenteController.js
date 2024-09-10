exports.registrarDocente = (req, res) => {
    const { nombre, email, materia } = req.body;

    // Aquí normalmente guardarías el docente en la base de datos
    // Simulación de registro exitoso
    res.status(201).json({ mensaje: "Docente registrado exitosamente", docente: { nombre, email, materia } });
};

exports.obtenerDocentes = (req, res) => {
    // Simulación de obtener docentes desde la base de datos
    const docentes = [
        { id: 1, nombre: 'Juan Pérez', email: 'juan.perez@mail.com', materia: 'Matemáticas' },
        { id: 2, nombre: 'María López', email: 'maria.lopez@mail.com', materia: 'Física' }
    ];
    res.json(docentes);
};
