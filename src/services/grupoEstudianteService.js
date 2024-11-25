const { pool } = require("../config/db"); // Asegúrate de importar el pool correctamente

exports.createGrupoEstudiante = async (grupoEstudianteData, client) => {
  const { cod_docente, cod_clase, cod_grupoempresa, codigo_sis, cod_horario } = grupoEstudianteData;

  await client.query(
    "INSERT INTO grupo_estudiante (cod_docente, cod_clase, cod_grupoempresa, codigo_sis, cod_horario) VALUES ($1, $2, $3, $4, $5)",
    [cod_docente, cod_clase, cod_grupoempresa, codigo_sis, cod_horario]
  );
};


exports.getEstudiantesSinGrupo = async (codigoClase) => {
  const query = `
  SELECT 
      e.codigo_sis, 
      e.nombre_estudiante, 
      e.apellido_estudiante
  FROM 
      ESTUDIANTE e
  WHERE 
      e.codigo_sis IN (
          SELECT ce.codigo_sis 
          FROM CLASE_ESTUDIANTE ce
          WHERE ce.cod_clase = $1
      )
      AND e.codigo_sis NOT IN (
          SELECT ge.codigo_sis
          FROM GRUPO_ESTUDIANTE ge
          WHERE ge.cod_clase = $1
      );
  `;

  try {
      const { rows } = await pool.query(query, [codigoClase]); // Pasar 'codigoClase' como array
      return rows; // Devuelve todos los registros
  } catch (error) {
      throw new Error("Error al obtener los estudiantes sin grupo.");
  }
};

exports.getEstudiantes = async (codigoGrupo) => {
  try {
    const query = `
    SELECT 
    e.codigo_sis, 
    e.nombre_estudiante, 
    e.apellido_estudiante,
    e.correo_estudiante,
    r.rol
    FROM 
        ESTUDIANTE e
    JOIN 
        GRUPO_ESTUDIANTE ge ON e.codigo_sis = ge.codigo_sis
    JOIN 
        ROL_ESTUDIANTE re ON e.codigo_sis = re.codigo_sis
    JOIN 
        ROL r ON r.cod_rol = re.cod_rol
    WHERE 
    ge.cod_grupoempresa = $1
    AND re.cod_gestion = (SELECT c.cod_gestion 
							FROM clase c
							WHERE c.cod_clase = ge.cod_clase)
    `;
  
    const result = await pool.query(query, [codigoGrupo]);
    return result.rows;
  } catch (error) {
      throw new Error("Error al obtener los estudiantes del grupo.");
  }
};

exports.getCodGrupo = async (codigoSis, codClase) => {
    try {
      const query = `
      SELECT cod_grupoempresa
      FROM grupo_estudiante
      WHERE codigo_sis = $1 AND cod_clase = $2 `;
      const result = await pool.query(query, [codigoSis, codClase]);
      return result.rows[0].cod_grupoempresa;
    } catch (error) {
        throw new Error("Error al obtener el codigo del grupo del estudiante.");
    }
  };

  exports.obtenerGrupoEmpresaDelEstudiante = async (codigoSis, codClase) => {
    try {
        const query = `
        SELECT ge.cod_grupoempresa, ge.nombre_corto, ge.nombre_largo
        FROM grupo_empresa ge
        INNER JOIN grupo_estudiante gest ON ge.cod_grupoempresa = gest.cod_grupoempresa
        WHERE gest.codigo_sis = $1 AND ge.cod_clase = $2
        `;
        const result = await pool.query(query, [codigoSis, codClase]);
        
        if (result.rows.length === 0) {
            throw new Error("No se encontró el grupo del estudiante en la clase especificada.");
        }
        return result.rows[0];
    } catch (error) {
        console.error("Error al obtener el grupo del estudiante:", error);
        throw error;
    }
};