const { pool } = require("../config/db"); // Asegúrate de importar el pool correctamente

exports.createGrupoEstudiante = async (grupoEstudianteData) => {
  const { cod_docente, cod_clase, cod_grupoempresa, codigo_sis } =
    grupoEstudianteData;

  await pool.query(
    "INSERT INTO grupo_estudiante (cod_docente, cod_clase, cod_grupoempresa, codigo_sis) VALUES ($1, $2, $3, $4)",
    [cod_docente, cod_clase, cod_grupoempresa, codigo_sis]
  );
};
