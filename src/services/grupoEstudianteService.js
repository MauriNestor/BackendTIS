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
    r.rol, 
    e.correo_estudiante
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

exports.agregarIntegrantesAlGrupo = async ({ codigoSis, codigoClase, codigoGrupo, estudiantes, roles }) => {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");

    const resEstudiante = await client.query(
      `SELECT cod_docente, cod_horario FROM grupo_estudiante 
      WHERE codigo_sis = $1 AND cod_clase = $2 AND cod_grupoempresa = $3`,
      [codigoSis, codigoClase, codigoGrupo]
    );

    if (resEstudiante.rows.length === 0) {
      throw new Error(`No se encontró el grupo o el estudiante en la base de datos.`);
    }

    const { cod_docente, cod_horario } = resEstudiante.rows[0];

    const resGestion = await client.query(
      "SELECT cod_gestion FROM clase WHERE cod_clase = $1",
      [codigoClase]
    );
    const cod_gestion = resGestion.rows[0].cod_gestion;

    for (let i = 0; i < estudiantes.length; i++) {
      const codigo_sis = estudiantes[i];
      const rol = roles[i];

      const resRol = await client.query(
        "SELECT cod_rol FROM rol WHERE rol = $1",
        [rol]
      );

      if (resRol.rows.length === 0) {
        throw new Error(`El rol "${rol}" no existe en la base de datos.`);
      }

      const cod_rol = resRol.rows[0].cod_rol;

      await client.query(
        `INSERT INTO grupo_estudiante (cod_docente, cod_clase, cod_grupoempresa, codigo_sis, cod_horario)
         VALUES ($1, $2, $3, $4, $5)`,
        [cod_docente, codigoClase, codigoGrupo, codigo_sis, cod_horario]
      );

      await client.query(
        `INSERT INTO rol_estudiante (codigo_sis, cod_rol, cod_gestion)
         VALUES ($1, $2, $3)`,
        [codigo_sis, cod_rol, cod_gestion]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al agregar estudiantes:", error.message);
    throw new Error("Error al agregar estudiantes.");
  } finally {
    client.release();
  }
};
