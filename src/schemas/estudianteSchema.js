const { z } = require('zod');

// Definir esquema con Zod
const estudianteSchema = z.object({
  codigo_sis: z.string()
    .min(8, 'El código SIS debe tener al menos 8 dígitos')
    .max(9, 'El código SIS debe tener como máximo 9 dígitos')
    .regex(/^\d+$/, 'El código SIS debe ser numérico'),
  nombres: z.string()
    .min(1, 'Los nombres son obligatorios')
    .regex(/^[\p{L}\s]+$/u, 'Los nombres solo deben contener letras'),
  apellidos: z.string()
    .min(1, 'Los apellidos son obligatorios')
    .regex(/^[\p{L}\s]+$/u, 'Los apellidos solo deben contener letras'),
  correo: z.string()
    .email('Debe ser un correo válido')
    .endsWith('@est.umss.edu', 'El correo debe ser institucional (@est.umss.edu)'),
  contraseña: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/\d/, 'La contraseña debe contener al menos un número'),
});


module.exports = estudianteSchema;
