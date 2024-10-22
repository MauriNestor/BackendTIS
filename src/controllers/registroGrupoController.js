const { pool } = require("../config/db");
const grupoEmpresaService = require("../services/grupoEmpresaService");
const grupoEstudianteService = require("../services/grupoEstudianteService");
const rolEstudianteService = require("../services/rolEstudianteService");

exports.registrarGrupo = async (req, res) => {
  const client = await pool.connect(); // Obtener el cliente para manejar la transacción

  try {
    await client.query("BEGIN"); // Iniciar transacción

    const {
      cod_docente,
      cod_clase,
      nombreLargo,
      nombreCorto,
      integrantes,
      cod_gestion,
      logo,
      cod_horario,
    } = req.body;

    const logotipoBuffer = logo ? Buffer.from(logo, "base64") : null;
    const parsedIntegrantes =
      typeof integrantes === "string" ? JSON.parse(integrantes) : integrantes;

    const cod_grupoempresa = await grupoEmpresaService.createGrupoEmpresa(
      {
        cod_docente,
        cod_clase,
        nombreLargo,
        nombreCorto,
        logotipo: logotipoBuffer,
        cod_horario,
      },
      client
    );

    for (const integrante of parsedIntegrantes) {
      const { codigo_sis, rol } = integrante;

      await grupoEstudianteService.createGrupoEstudiante(
        {
          cod_docente,
          cod_clase,
          cod_grupoempresa,
          codigo_sis,
          cod_horario,
        },
        client
      );

      const cod_rol = await rolEstudianteService.getCodRolByName(rol, client);

      await rolEstudianteService.createRolEstudiante(
        {
          codigo_sis,
          cod_rol,
          cod_gestion,
        },
        client
      );
    }

    await client.query("COMMIT"); // Confirmar la transacción
    res.status(201).json({ message: "Grupo registrado exitosamente." });
  } catch (error) {
    await client.query("ROLLBACK"); // Hacer rollback en caso de error
    console.error("Error al registrar el grupo:", error);
    res.status(500).json({
      message: "Error al registrar el grupo.",
      error: error.message,
    });
  } finally {
    client.release(); // Liberar el cliente de la conexión
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

    res.status(200).json(estudiantesSinGrupo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener los datos de los estudiantes sin grupo",
    });
  }
};

exports.getGrupoEmpresa = async (req, res) => {
  try {
    const { codigoGrupo } = req.params; // Obtener el código de clase de los parámetros de la solicitud
    // Llamar al servicio para obtener los estudiantes sin grupo
    const grupo_empresa = await grupoEmpresaService.getGrupoEmpresa(
      codigoGrupo
    );

    res.status(200).json(grupo_empresa);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener los datos de la grupo empresa",
    });
  }
};

exports.getGrupoConRubricas = async (req, res) => {
  const { codGrupo, codEvaluacion } = req.params;

  if (
    !codGrupo ||
    isNaN(codGrupo) ||
    parseInt(codGrupo) <= 0 ||
    !codEvaluacion ||
    isNaN(codEvaluacion) ||
    parseInt(codEvaluacion) <= 0
  ) {
    return res
      .status(400)
      .json({
        error:
          "El código del grupo y el código de evaluación deben ser números válidos",
      });
  }

  try {
    const result = await grupoEmpresaService.getGrupoEmpresaConRubricas(
      parseInt(codGrupo),
      parseInt(codEvaluacion)
    );
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener el grupo y las rúbricas",
      detalle: error.message,
    });
  }
};

exports.getEstudiantesDeGrupo = async (req, res) => {
  const { codGrupo } = req.params;

  // Validar que codGrupo sea un número entero válido
  if (!codGrupo || isNaN(codGrupo) || parseInt(codGrupo) <= 0) {
    return res
      .status(400)
      .json({ error: "El código del grupo debe ser un número válido" });
  }

  try {
    const estudiantes = await grupoEstudianteService.getEstudiantes(
      parseInt(codGrupo)
    );
    res.status(200).json(estudiantes);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener los estudiantes del grupo",
      detalle: error.message,
    });
  }
};
