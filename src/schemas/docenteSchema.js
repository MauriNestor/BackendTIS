const { z } = require('zod');

// Definir esquema con Zod
const docenteSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').regex(/^[a-zA-Z]+$/, 'El nombre solo debe contener letras'),
  apellido: z.string().min(1, 'El apellido es obligatorio').regex(/^[a-zA-Z]+$/, 'El apellido solo debe contener letras'),
  correo: z.string().email('Debe ser un correo válido').endsWith('@umss.edu.bo', 'El correo debe ser institucional (@umss.edu.bo)'),
  contraseña: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula').regex(/\d/, 'La contraseña debe contener al menos un número'),
});

module.exports = docenteSchema;
