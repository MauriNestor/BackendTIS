const { pool } = require("../config/db"); // Asegúrate de importar el pool correctamente

exports.createRolEstudiante = async (rolEstudianteData, client) => {
  const { cod_rol, codigo_sis, cod_gestion } = rolEstudianteData;

  await client.query(
    "INSERT INTO rol_estudiante (cod_rol, codigo_sis, cod_gestion) VALUES ($1, $2, $3)",
    [cod_rol, codigo_sis, cod_gestion]
  );
};


// Método para obtener el código del rol basado en el nombre del rol
exports.getCodRolByName = async (rolName) => {
  const result = await pool.query("SELECT cod_rol FROM rol WHERE rol = $1", [
    rolName,
  ]);
  return result.rows.length > 0 ? result.rows[0].cod_rol : null;
};
