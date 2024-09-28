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

const registrarSprint = async (codigoProduct, sprint, fechaInicio, fechaFin, objetivo, requerimientos) => {
    try {
        console.log(typeof codigoProduct, typeof sprint); // Esto debería mostrar "number"

        // Validar que los datos son del tipo correcto
        if (typeof codigoProduct !== 'number' || typeof sprint !== 'number') {
            throw new Error('codigoProduct y sprint deben ser números.');
        }
        if (!fechaInicio || !fechaFin) {
            throw new Error('fechaInicio y fechaFin son obligatorios.');
        }

        // Imprimir para depuración
        console.log(`Insertando sprint: ${codigoProduct}, ${sprint}, ${fechaInicio}, ${fechaFin}, ${objetivo}`);

        const result = await pool.query(
            'INSERT INTO sprint (cod_product, sprint, fecha_inicio_sprint, fecha_fin_sprint, objetivo_sprint) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [codigoProduct, sprint, fechaInicio, fechaFin, objetivo]
        );

        const codSprint = result.rows[0].cod_sprint;

        // Actualizar requerimientos
        for (const requerimiento of requerimientos) {
            const updateResult = await pool.query(
                'UPDATE requerimiento SET cod_sprint = $1 WHERE cod_requerimiento = $2',
                [codSprint, requerimiento.codRequerimiento]
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
