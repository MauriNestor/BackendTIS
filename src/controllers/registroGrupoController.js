const grupoEmpresaService = require("../services/grupoEmpresaService");
const grupoEstudianteService = require("../services/grupoEstudianteService");
const rolEstudianteService = require("../services/rolEstudianteService");

exports.registrarGrupo = async (req, res) => {
  try {
    const { cod_docente, cod_clase, nombreLargo, nombreCorto, integrantes } =
      req.body;
    console.log("Integrantes recibidos:", integrantes);
    const parsedIntegrantes =
      typeof integrantes === "string" ? JSON.parse(integrantes) : integrantes;
    const logotipo = req.file ? req.file.filename : null;
    console.log("Integrantes procesados:", parsedIntegrantes);
    // Inserta en la tabla grupo_empresa y obtiene el cod_grupoempresa generado
    const cod_grupoempresa = await grupoEmpresaService.createGrupoEmpresa({
      cod_docente,
      cod_clase,
      nombreLargo,
      nombreCorto,
      logotipo,
    });

    // Insertar cada integrante en grupo_estudiante y rol_estudiante
    for (const integrante of parsedIntegrantes) {
      const { codigo_sis, rol, nombre } = integrante; // Extrae el codigo_sis directamente
      console.log(`Nombre: ${nombre}, Codigo SIS: ${codigo_sis}`);
      // Insertar en grupo_estudiante
      await grupoEstudianteService.createGrupoEstudiante({
        cod_docente,
        cod_clase,
        cod_grupoempresa,
        codigo_sis, // Usa el codigo_sis directamente
      });

      // Insertar en rol_estudiante
      const cod_rol = await rolEstudianteService.getCodRolByName(rol);
      await rolEstudianteService.createRolEstudiante({
        codigo_sis,
        cod_rol,
        cod_gestion: 1, // Ajusta según tu lógica
      });
    }

    res.status(200).json({ message: "Grupo registrado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al registrar el grupo.",
      error: error.message,
    });
  }
};
