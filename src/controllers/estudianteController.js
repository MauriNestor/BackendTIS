const EstudianteService = require('../services/estudianteService');

exports.registrarEstudiante = async (req, res) => {
    const { codigo_sis, nombres, apellidos, correo, contraseña } = req.body;

    try{
        const nuevoEstudiante = await EstudianteService.createEstudiante({codigo_sis, nombres, apellidos, correo, contraseña});
        res.status(201).json({
            mensaje: 'Estudiante registrado exitosamente',
            estudiante: nuevoEstudiante
        });
    }
    catch(error){
        res.status(500).json({
            error: 'Error al registrar estudiante',
            detalle: error.message
        });
    }
}

exports.obtenerEstudiantes = async (req, res) => {
    try{
        const estudiantes = await EstudianteService.getAllEstudiantes();
        res.status(200).json(estudiantes);
    }
    catch(error){
        res.status(500).json({
            error: 'Error al obtener los estudiantes',
            detalle: error.message
        });
    }
}