const db = require('../config/db');
const pool = db.pool; 

const registrarPlanificacion = async (codigoClase, codigoGrupo, client) => {
    try {
        const codigoDocente = await getDocente(codigoClase);
        
        // Usar el cliente de transacción `client` para realizar la consulta
        const result = await client.query(
            'INSERT INTO productbacklog (cod_docente, cod_clase, cod_grupoempresa) VALUES ($1, $2, $3) RETURNING *',
            [codigoDocente, codigoClase, codigoGrupo]
        );

        const codProduct = result.rows[0].cod_product;

        return codProduct;  // Devuelve el código generado si es necesario
       
    } catch (err) {
        console.error('Error al crear product backlog', err);
        throw err;
    }
};

const registrarRequerimientos = async (codigoGrupo, requerimientos) => {
    try {
        const estado = "Pendiente";
        const codigoProduct = await obtenerCodProductBacklog(codigoGrupo);  
        console.log(codigoProduct);
        for (const requerimiento of requerimientos) { 
            const result = await pool.query(
                'INSERT INTO requerimiento (cod_product, requerimiento, decripcion_hu, prioridad_hu, estimacion_hu, estado_hu) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [codigoProduct, requerimiento.requerimiento, requerimiento.descripcion, parseInt(requerimiento.prioridad), parseInt(requerimiento.estimacion), estado]
            );
        }
    } catch (err) {
        console.error('Error al crear requerimiento', err);
        throw err;
    }
};

const registrarSprint = async (codigoGrupo, sprint, fechaInicio, fechaFin, objetivo) => {
    try {
        // Validar que los datos son del tipo correcto
        if (typeof codigoGrupo !== 'number' || typeof sprint !== 'number') {
            throw new Error('codigoGrupo y sprint deben ser números.');
        }
        if (!fechaInicio || !fechaFin) {
            throw new Error('fechaInicio y fechaFin son obligatorios.');
        };
        const codigoProduct = await obtenerCodProductBacklog(codigoGrupo); 
        const result = await pool.query(
            'INSERT INTO sprint (cod_product, sprint, fecha_inicio_sprint, fecha_fin_sprint, objetivo_sprint) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [codigoProduct, sprint, fechaInicio, fechaFin, objetivo]
        );

        const codSprint = result.rows[0].cod_sprint;
        return codSprint;
    } catch (err) {
        console.error('Error al registrar sprint', err);
        throw err;
    }
};

const registrarRequerimientoASprint = async (codSprint, requerimientos) => {
    try {
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

const obtenerSprint = async (codigoGrupo) => {
    try {
        const result = await pool.query(
            'SELECT * FROM sprint as s WHERE s.cod_product = (SELECT pb.cod_product FROM productbacklog as pb WHERE cod_grupoempresa = $1)',
            [codigoGrupo]
        );

        const sprints = result.rows;
        if (sprints.length === 0) {
            return { message: "No se encontraron sprints para el grupo especificado." };
        }

        const sprintsConRequerimientos = [];

        // Iterar sobre los sprints obtenidos
        for (const sprint of sprints) {
            const codSprint = sprint.cod_sprint;

            const requerimientosXSprint = await pool.query(
                'SELECT * FROM requerimiento as r WHERE r.cod_sprint = $1',
                [codSprint]
            );

            sprintsConRequerimientos.push({
                sprint: sprint,
                requerimientos: requerimientosXSprint.rows
            });
        }

        return sprintsConRequerimientos;

    } catch (err) {
        console.error('Error al obtener sprintbacklog', err);
        throw err;
    }
};

const obtenerProductBacklog = async (codigoGrupo) => {
    try {
        const result = await pool.query(
            'SELECT * FROM requerimiento as r WHERE r.cod_product = (SELECT pb.cod_product FROM productbacklog as pb WHERE cod_grupoempresa = $1) AND r.cod_sprint IS NULL',
            [codigoGrupo]
        );
        const backlog = result.rows;
        return backlog;

    }  catch (err) {
        console.error('Error al obtener productbacklog', err);
        throw err;
    }
};

const obtenerTodoProductBacklog = async (codigoGrupo) => {
    try {
        const result = await pool.query(
            'SELECT * FROM requerimiento as r WHERE r.cod_product = (SELECT pb.cod_product FROM productbacklog as pb WHERE cod_grupoempresa = $1)',
            [codigoGrupo]
        );
        const backlog = result.rows;
        return backlog;

    }  catch (err) {
        console.error('Error al obtener todo el productbacklog', err);
        throw err;
    }
};

const obtenerCodProductBacklog = async (codigoGrupo) => {
    try {
        const result = await pool.query(
            'SELECT cod_product FROM productbacklog WHERE cod_grupoempresa = $1',
            [codigoGrupo]
        );
        const codProduct = result.rows[0]?.cod_product;  // Utilizamos optional chaining para evitar errores si no existe
        
        if (!codProduct) {
            throw new Error('Código de product backlog no encontrado para el grupo dado');
        }
        
        return codProduct;
    }  catch (err) {
        console.error('Error al obtener codigo de productbacklog', err);
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
    obtenerSprint,
    obtenerProductBacklog,
    getDocente,
    registrarRequerimientoASprint,
    obtenerTodoProductBacklog,
};
