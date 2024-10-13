// grupoEmpresaService.js
const { pool } = require("../config/db");
const planificacionService = require('../services/planificacionService');
const grupoEstudianteService = require('../services/grupoEstudianteService');

exports.createGrupoEmpresa = async (data, client) => {
  const { cod_docente, cod_clase, nombreLargo, nombreCorto, logotipo, cod_horario } = data;

  try {
    const nombreAceptable = await verificarNombreGrupo(nombreCorto);

    if (!nombreAceptable) {
      throw new Error("El nombre del grupo ya está en uso. Elige otro.");
    }

    const query = `
      INSERT INTO grupo_empresa (cod_docente, cod_clase, nombre_largo, nombre_corto, logotipo, cod_horario)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING cod_grupoempresa;
    `;

    const values = [cod_docente, cod_clase, nombreLargo, nombreCorto, logotipo, cod_horario];

    const result = await client.query(query, values);
    await planificacionService.registrarPlanificacion(cod_clase, result.rows[0].cod_grupoempresa, client);
    
    return result.rows[0].cod_grupoempresa;
  } catch (error) {
    console.error("Error al crear grupo empresa:", error.message);
    throw new Error("Hubo un error al crear el grupo empresa. Inténtalo de nuevo.");
  }
};


exports.getAllGruposEmpresa = async (codigoClase) => {
  const query =
    "SELECT cod_grupoempresa, nombre_largo, nombre_corto, logotipo FROM grupo_empresa WHERE cod_clase = $1";

  try {
    const { rows } = await pool.query(query, [codigoClase]);
    return rows; // Devuelve todos los registros
  } catch (error) {
    throw new Error("Error al obtener los datos de los grupos empresa.");
  }
};

exports.getGrupoEmpresa = async (codigoGrupo) => {
  try {
    const query =
      "SELECT cod_clase, cod_grupoempresa, nombre_corto, nombre_largo, logotipo, cod_horario FROM grupo_empresa WHERE cod_grupoempresa = $1";

    const result = await pool.query(query, [codigoGrupo]); // Cambié 'rows' a 'result' para evitar confusiones
    const integrantes = await grupoEstudianteService.getEstudiantes(codigoGrupo);

    if (result.rows.length > 0) {
      const grupoEmpresa = result.rows[0]; // Accede al primer (y único) resultado de la consulta
      return { ...grupoEmpresa, integrantes }; // Devuelve los datos de grupo_empresa y los integrantes
    } else {
      const message ="No se encontró la grupo-empresa.";
      return message;
    }
  } catch (error) {
    throw new Error("Error al obtener los datos de grupo empresa.");
  }
};


const verificarNombreGrupo = async (nombreCorto) => {
  try {
    const query =
      "SELECT nombre_corto FROM Grupo_empresa WHERE nombre_corto = $1 ";
    const result = await pool.query(query, [nombreCorto]);

    if (result.rows.length === 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Error al verificar nombre de grupo", err);
    throw err;
  }
};
