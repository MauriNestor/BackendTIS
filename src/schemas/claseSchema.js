const { z } = require('zod');

// Definir esquema para la creación de una clase
const claseSchema = z.object({
  cod_docente: z.number().int().min(1, 'El código de docente es obligatorio y debe ser un número entero'),
  cod_clase: z.number().int().min(1, 'El código de clase es obligatorio y debe ser un número entero'),
  cod_gestion: z.number().int().min(1, 'El código de gestión es obligatorio y debe ser un número entero'),
  codigo: z.string().min(1, 'El código de la clase es obligatorio').max(10, 'El código de la clase no debe exceder 10 caracteres'),
  nombre_clase: z.string().min(1, 'El nombre de la clase es obligatorio').max(50, 'El nombre de la clase no debe exceder 50 caracteres')
});

module.exports = claseSchema;
