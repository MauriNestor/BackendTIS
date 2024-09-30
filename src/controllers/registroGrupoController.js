const grupoEmpresaService = require("../services/grupoEmpresaService");
const grupoEstudianteService = require("../services/grupoEstudianteService");
const rolEstudianteService = require("../services/rolEstudianteService");

exports.registrarGrupo = async (req, res) => {
  try {
    const {
      cod_docente,
      cod_clase,
      nombreLargo,
      nombreCorto,
      integrantes,
      logo, // Cambiar logotipo a logo aquí
    } = req.body;

    // Decodificar el logo base64 (si es necesario)
    console.log("logo antes : ", logo); // Cambiar el mensaje para que sea más claro
    const logotipoBuffer = logo ? Buffer.from(logo, "base64") : null;
    console.log("logo buffer después : ", logotipoBuffer); // Cambiar el mensaje aquí también

    const parsedIntegrantes =
      typeof integrantes === "string" ? JSON.parse(integrantes) : integrantes;

    // Inserta en la tabla grupo_empresa y obtiene el cod_grupoempresa generado
    const cod_grupoempresa = await grupoEmpresaService.createGrupoEmpresa({
      cod_docente,
      cod_clase,
      nombreLargo,
      nombreCorto,
      logotipo: logotipoBuffer, // Guardar logotipo como un buffer o como string
    });

    // Insertar cada integrante en grupo_estudiante y rol_estudiante
    for (const integrante of parsedIntegrantes) {
      const { codigo_sis, rol } = integrante;

      // Insertar en grupo_estudiante
      await grupoEstudianteService.createGrupoEstudiante({
        cod_docente,
        cod_clase,
        cod_grupoempresa,
        codigo_sis,
      });

      // Insertar en rol_estudiante
      const cod_rol = await rolEstudianteService.getCodRolByName(rol);
      await rolEstudianteService.createRolEstudiante({
        codigo_sis,
        cod_rol,
        cod_gestion: 2, // Ajusta según tu lógica
      });
    }

    res.status(201).json({ message: "Grupo registrado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al registrar el grupo.",
      error: error.message,
    });
  }
};
exports.getAllGruposEmpresa = async (req, res) => {
  try {
    const gruposEmpresa = await grupoEmpresaService.getAllGruposEmpresa();

    // Convertir los logos en base64 si están almacenados como Buffer
    const gruposConLogoBase64 = gruposEmpresa.map((grupo) => ({
      ...grupo,
      logotipo: grupo.logotipo ? grupo.logotipo.toString("base64") : null,
    }));

    res.status(200).json(gruposConLogoBase64);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener los datos de los grupos empresa" });
  }
};
