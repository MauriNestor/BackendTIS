const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');

exports.registrarEstudiante = (req, res) => {
    const { codigo_sis, nombres, apellidos, correo, contraseña } = req.body;

    res.status(201).json({
        mensaje: "Estudiante registrado exitosamente",
        estudiante: {
            codigo_sis,
            nombres,
            apellidos,
            correo
        }
    });
};

exports.obtenerEstudiantes = (req, res) => {
    const estudiantes = [
      { id: 1, codigo_sis: '1234567', nombres: 'Ana', apellidos: 'Rojas', correo: 'ana.rojas@umss.ed.bo' },
      { id: 2, codigo_sis: '2345678', nombres: 'Luis', apellidos: 'Martinez', correo: 'luis.martinez@umss.edu.bo' },
      { id: 3, codigo_sis: '3456789', nombres: 'Sofia', apellidos: 'Perez', correo: 'sofia.perez@umss.edu.bo' }
    ];
  
    res.status(200).json(estudiantes);
  };