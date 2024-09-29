const { z } = require('zod');

const claseSchema = z.object({
  codGestion: z.number()
    .int('El código de gestión debe ser un número entero')
    .min(2024, 'El código de gestión debe ser mayor a 2023') 
    .max(2026, 'El código de gestión no debe ser superior a 9999')
    .refine(value => value !== null && value !== undefined, { message: 'El año de gestión es obligatorio' }),
  
    nombreClase: z.string()
    .min(1, 'El nombre de la clase es obligatorio')
    .max(50, 'El nombre de la clase no debe exceder 50 caracteres')
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:()\-]+$/, 'El nombre de la clase solo debe contener letras, números, espacios y caracteres especiales permitidos')
});

module.exports = claseSchema;
