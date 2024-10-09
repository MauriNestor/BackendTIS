// grupoEmpresaService.js
const { pool } = require("../config/db");

exports.createGrupoEmpresa = async (data) => {
  const {
    cod_docente,
    cod_clase,
    nombreLargo,
    nombreCorto,
    logotipo,
    cod_horario,
  } = data;

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

    const values = [
      cod_docente,
      cod_clase,
      nombreLargo,
      nombreCorto,
      logotipo,
      cod_horario,
    ];
    const result = await pool.query(query, values);

    return result.rows[0].cod_grupoempresa;
  } catch (error) {
    console.error("Error al crear grupo empresa:", error.message);
    throw new Error(
      "Hubo un error al crear el grupo empresa. Inténtalo de nuevo."
    );
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
