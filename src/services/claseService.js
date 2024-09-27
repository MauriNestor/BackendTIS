const { pool } = require('../config/db');

const ClassService = {
    crearClase: async ({ cod_docente, cod_clase, cod_gestion, codigo, nombre_clase }) => {
        try {
            const result = await pool.query(
              `INSERT INTO clase (COD_DOCENTE, COD_CLASE, COD_GESTION, CODIGO, NOMBRE_CLASE) 
               VALUES ($1, $2, $3, $4, $5) RETURNING *`,
              [cod_docente, cod_clase, cod_gestion, codigo, nombre_clase]
            );
            return result.rows[0];
          } catch (error) {
            throw new Error(`Error al crear la clase: ${error.message}`);
          }
        }
      };
      
      module.exports = ClassService;