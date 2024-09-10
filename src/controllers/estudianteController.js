const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');

exports.registrarEstudiante = (req, res) => {
    const { nombre, email, curso } = req.body;

    // Aquí es donde normalmente guardarías el estudiante en la base de datos
    // Simulación de registro exitoso
    res.status(201).json({ mensaje: "Estudiante registrado exitosamente", estudiante: { nombre, email, curso } });
};

exports.obtenerEstudiantes = (req, res) => {
    // Simulación de obtener estudiantes desde la base de datos
    const estudiantes = [
        { id: 1, nombre: 'Ana García', email: 'ana.garcia@mail.com', curso: 'Matemáticas' },
        { id: 2, nombre: 'Carlos Ramírez', email: 'carlos.ramirez@mail.com', curso: 'Física' }
    ];
    res.json(estudiantes);
};
