const grupoEstudianteService = require("../services/grupoEstudianteService");

async function estudiantesGrupo(req, res) {
    const { codClase } = req.params; 
    const codigoSis = req.user.codigoSis; 

    try {
        const grupo = await grupoEstudianteService.obtenerGrupoEmpresaDelEstudiante(codigoSis, codClase);
        
        const estudiantes = await grupoEstudianteService.getEstudiantes(grupo.cod_grupoempresa);

        res.status(200).json({
            nombre_corto: grupo.nombre_corto,
            nombre_largo: grupo.nombre_largo,
            estudiantes,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener los estudiantes y el grupo del estudiante",
            detalle: error.message,
        });
    }
};

module.exports = { estudiantesGrupo };