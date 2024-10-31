const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');

const verificarGrupoEstudiante = async (req, res, next) => {
    const codigoGrupo = req.params.codigoGrupo || req.body.codigoGrupo;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Adjuntar la información del usuario decodificada al objeto 'req'
        req.user = decoded; 
        const codigoSis = req.user.codigoSis;
        if(req.user.role !== 'docente'){
          const sisResult = await pool.query('SELECT * FROM grupo_estudiante WHERE CODIGO_SIS = $1 AND COD_GRUPOEMPRESA = $2', [codigoSis, codigoGrupo]);
          
          if (sisResult.rows.length === 0) {
              return res.status(400).json({
              error: 'El estudiante no se encuentra en este grupo',
              detalle: 'El estudiante no se encuentra en este grupo'
              });
          }
        }
        
        next();
    } catch (error) {
      res.status(500).json({
        error: 'Error al validar grupo del estudiante',
        detalle: error.message
      });
    }
  };
  
  module.exports = verificarGrupoEstudiante;
  