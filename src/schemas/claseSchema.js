const { z } = require('zod');

const claseSchema = z.object({
  codGestion: z.number()
    .int()
    .refine(val => val === 1 || val === 2, {
      message: 'El código de gestión debe ser 1 o 2'
    }), // Permitir solo 1 o 2
  nombreClase: z.string()
    .min(1, 'El nombre de la clase es obligatorio')
    .max(50, 'El nombre de la clase no debe exceder 50 caracteres')
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:()\-]+$/, 'El nombre de la clase solo debe contener letras, números, espacios y caracteres especiales permitidos')
});

module.exports = claseSchema;
