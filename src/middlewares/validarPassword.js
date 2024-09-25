const passwordSchema = require('../schemas/passwordSchema');

const validarPassword = (req, res, next) => {
    try {
        passwordSchema.parse(req.body);  // Valida el cuerpo de la solicitud
        next();  // Si pasa la validación, continúa con el siguiente middleware/controlador
    } catch (error) {
        // Si error.errors no está definido, devuelve un error genérico
        const errores = error.errors
            ? error.errors.map((err) => ({
                  campo: err.path[0],
                  mensaje: err.message,
              }))
            : [{ campo: 'general', mensaje: 'Error de validación desconocido' }];
        
        return res.status(400).json({ errores });
    }
};

module.exports = validarPassword;
