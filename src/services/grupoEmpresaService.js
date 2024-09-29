// grupoEmpresaService.js
const { pool } = require("../config/db"); // Importar pool directamente
exports.createGrupoEmpresa = async (data) => {
  const { cod_docente, cod_clase, nombreLargo, nombreCorto, logotipo } = data;

  // Asegúrate de que la consulta sea válida
  const query = `
    INSERT INTO grupo_empresa (cod_docente, cod_clase, nombre_largo, nombre_corto, logotipo)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING cod_grupoempresa; 
  `;

  const values = [cod_docente, cod_clase, nombreLargo, nombreCorto, logotipo];

  try {
    const result = await pool.query(query, values); // Usa pool para hacer la consulta
    return result.rows[0].cod_grupoempresa; // Devuelve el código del grupo
  } catch (error) {
    console.error("Error al crear grupo empresa:", error);
    throw error; // Propaga el error para manejarlo en el controlador
  }
};
