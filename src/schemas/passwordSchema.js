const { z } = require('zod');

const passwordSchema = z.object({
    newPassword: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
        .regex(/\d/, 'La contraseña debe contener al menos un número'),
});

module.exports = passwordSchema;
