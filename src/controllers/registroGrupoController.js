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
      cod_gestion,
      logo, // Recibe el logotipo
      cod_horario, // Asegúrate de recibir también el cod_horario
    } = req.body;

    // Decodificar el logo base64 (si es necesario)

    const logotipoBuffer = logo ? Buffer.from(logo, "base64") : null;

    // Parsear los integrantes si es un string JSON
    const parsedIntegrantes =
      typeof integrantes === "string" ? JSON.parse(integrantes) : integrantes;

    // Inserta en la tabla grupo_empresa y obtiene el cod_grupoempresa generado
    const cod_grupoempresa = await grupoEmpresaService.createGrupoEmpresa({
      cod_docente,
      cod_clase,
      nombreLargo,
      nombreCorto,
      logotipo: logotipoBuffer, // Se pasa como buffer o null si no existe logo
      cod_horario, // Se agrega el cod_horario que requiere el servicio
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
        cod_horario,
      });

      // Obtener el código de rol a partir del nombre del rol
      const cod_rol = await rolEstudianteService.getCodRolByName(rol);

      // Insertar el rol del estudiante
      await rolEstudianteService.createRolEstudiante({
        codigo_sis,
        cod_rol,
        cod_gestion, // Ajusta esto según la lógica de gestión de tu aplicación
      });
    }

    // Respuesta exitosa
    res.status(201).json({ message: "Grupo registrado exitosamente." });
  } catch (error) {
    console.error("Error al registrar el grupo:", error);
    res.status(500).json({
      message: "Error al registrar el grupo.",
      error: error.message,
    });
  }
};

exports.getAllGruposEmpresa = async (req, res) => {
  try {
    const { codigoClase } = req.params;
    const gruposEmpresa = await grupoEmpresaService.getAllGruposEmpresa(
      codigoClase
    );

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
exports.getEstudiantesSinGruposEmpresa = async (req, res) => {
  try {
    const { codigoClase } = req.params; // Obtener el código de clase de los parámetros de la solicitud

    // Llamar al servicio para obtener los estudiantes sin grupo
    const estudiantesSinGrupo =
      await grupoEstudianteService.getEstudiantesSinGrupo(codigoClase);

    // Verificar si se encontraron estudiantes
    if (estudiantesSinGrupo.length === 0) {
      return res
        .status(404)
        .json({
          message:
            "No se encontraron estudiantes sin grupo para la clase especificada",
        });
    }

    res.status(200).json(estudiantesSinGrupo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error al obtener los datos de los estudiantes sin grupo",
      });
  }
};
