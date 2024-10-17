const { pool } = require('../config/db');
const horarioService = require('../services/horarioService');  
const grupoEmpresaService = require('../services/grupoEmpresaService');

const asignarEvaluacion = async (codigoDocente, codigoClase, codigoEvaluacion, codigoGrupos) => {
    try {
        let codHorario;
        for (const codGrupo of codigoGrupos) {
            if (codGrupo === 0){
                const grupos = await grupoEmpresaService.getAllGruposEmpresa(codigoClase);
                for (const grupo of grupos) {
                    
                    codHorario = await horarioService.getCodHorario(grupo.cod_grupoempresa);
                    await crearEntregable(codigoDocente, codigoClase, codigoEvaluacion, grupo.cod_grupoempresa, codHorario);
                }
            } else {
                codHorario = await horarioService.getCodHorario(codGrupo);
                await crearEntregable(codigoDocente, codigoClase, codigoEvaluacion, codGrupo, codHorario);
            }
        }
        return true;
    } catch (err) {
        console.error('Error al asignar evaluacion', err);
        throw err;
    }
};

const crearEntregable = async (codigoDocente, codigoClase, codigoEvaluacion, codGrupo, codHorario) => {
    try {
        const result = await pool.query(
            `INSERT INTO Entregable (cod_docente, cod_clase, cod_grupoempresa, cod_evaluacion, cod_horario) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
            [codigoDocente, codigoClase,codGrupo,codigoEvaluacion, codHorario]
        );
        console.log("Evaluacion asignada");
    } catch (err) {
        console.error('Error al crear entregable', err);
        throw err;
    }
};

module.exports = {
    asignarEvaluacion,
};