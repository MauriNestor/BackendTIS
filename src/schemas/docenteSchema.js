const { z } = require('zod');

const docenteSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es obligatorio')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo debe contener letras'),
  apellido: z.string()
    .min(1, 'El apellido es obligatorio')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo debe contener letras'),
  correo: z.string()
    .email('Debe ser un correo válido')
    .refine((correo) => correo.endsWith('@umss.edu.bo') || correo.endsWith('@fcyt.umss.edu.bo') || correo.endsWith('@umss.edu'), {
      message: 'El correo debe ser institucional (@umss.edu.bo, @fcyt.umss.edu.bo o @umss.edu)',
    }),
  contraseña: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/\d/, 'La contraseña debe contener al menos un número'),
});

module.exports = docenteSchema;
