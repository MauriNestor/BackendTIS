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
        console.error('Error al crear product backlog', err);
        throw err;
    }
};

const registrarRequerimientos = async (codigoProduct, requerimientos) => {
    try {
        const estado = "Pendiente";
       
        for (const requerimiento of requerimientos) {
            
            const result = await pool.query(
                'INSERT INTO requerimiento (cod_product, requerimiento, decripcion_hu, prioridad_hu, estimacion_hu, estado_hu) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [codigoProduct, requerimiento.requerimiento, requerimiento.descripcion, requerimiento.prioridad, requerimiento.estimacion, estado] 
            ); 
        }
    } catch (err) {
        console.error('Error al crear requerimiento', err);
        throw err;
    }
};

const registrarSprint = async (sprint, fechaInicio, fechaFin, objetivo, requerimientos) => {
    try {
        const result = await pool.query(
            'INSERT INTO sprint (sprint, fecha_inicio_sprint, fecha_fin_sprint, objetivo_sprint) VALUES ($1, $2, $3, $4) RETURNING *',
            [sprint, fechaInicio, fechaFin, objetivo]
        );
        const codSprint = result.rows[0].cod_sprint;
        for (const requerimiento of requerimientos) {
            const result = await pool.query(
                'UPDATE requermiento SET cod_sprint = $1 WHERE cod_requerimiento = $2',
                [codSprint, requerimiento.codRequermiento]
            );
        }
    } catch (err) {
        console.error('Error al registrar sprintbacklog', err);
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
    registrarRequerimientos,
    registrarSprint,
};
