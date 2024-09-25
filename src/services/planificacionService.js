const db = require('../config/db');
const pool = db.pool; 
const registrarPlanificacion = async (codigoClase, codigoGrupo) => {
    try {
        const codigoDocente = await getDocente(codigoClase); 
        const result = await pool.query(
            'INSERT INTO productbacklog (cod_docente, cod_clase, cod_grupoempresa) VALUES ($1, $2, $3) RETURNING *',
            [codigoDocente, codigoClase, codigoGrupo]
        );
        const codProduct = result.rows[0].cod_product;
       
    } catch (err) {
        console.error('Error al crear actividad', err);
        throw err;
    }
};

const getDocente = async (codigoClase) => {
    const result = await pool.query(
        'SELECT cod_docente FROM clase WHERE cod_clase = $1',
        [codigoClase]
    );
    return result.rows[0]?.cod_docente;  
};

module.exports = {
    registrarPlanificacion, 
};
