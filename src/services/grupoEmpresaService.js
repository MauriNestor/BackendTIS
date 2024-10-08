// grupoEmpresaService.js
const { pool } = require("../config/db");

exports.createGrupoEmpresa = async (data) => {
  const { cod_docente, cod_clase, nombreLargo, nombreCorto, logotipo } = data;

  const query = `
    INSERT INTO grupo_empresa (cod_docente, cod_clase, nombre_largo, nombre_corto, logotipo)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING cod_grupoempresa;
  `;

  const values = [cod_docente, cod_clase, nombreLargo, nombreCorto, logotipo];

  try {
    const result = await pool.query(query, values);
    return result.rows[0].cod_grupoempresa;
  } catch (error) {
    console.error("Error al crear grupo empresa:", error);
    throw error;
  }
};

exports.getAllGruposEmpresa = async () => {
  const query =
    "SELECT cod_grupoempresa, nombre_largo, nombre_corto, logotipo FROM grupo_empresa";

  try {
    const { rows } = await pool.query(query);
    return rows; // Devuelve todos los registros
  } catch (error) {
    throw new Error("Error al obtener los datos de los grupos empresa.");
  }
};
