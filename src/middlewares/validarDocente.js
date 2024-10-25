const docenteSchema = require('../schemas/docenteSchema');

const validarDocente = async (req, res, next) => {
    try {
        await docenteSchema.parseAsync(req.body);
        next();
    }catch(error){
        res.status(400).json({
            error: error.errors[0]
        });
    }   
}
module.exports = validarDocente;
