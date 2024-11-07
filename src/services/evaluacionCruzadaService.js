const { pool } = require('../config/db');
const grupoEmpresaService = require('../services/grupoEmpresaService');
const grupoEstudianteService = require('../services/grupoEstudianteService');

const registrarEvalCruzada = async (codEvaluacion, codclase) => {
    try {
        const listaGrupos = await crearListaEvaluador(codclase);
        console.log(listaGrupos);
        for (const par of listaGrupos) {
            const result = await pool.query(
            `INSERT INTO evaluacion_cruzada (cod_evaluacion, grupo_evaluador, grupo_evaluado)
            VALUES ($1, $2, $3) RETURNING *`,
                [codEvaluacion, par.evaluador, par.evaluado]
            );
        }
        return true;

    }  catch (err) {
        console.error('Error al registrar el horario', err);
        throw err;
    }
};

const crearListaEvaluador = async (codClase) => {
    try {
        const grupos = await grupoEmpresaService.getAllGruposEmpresa(codClase);
        console.log("grupos clase:", grupos);
        const codGrupos = grupos.map(grupo => grupo.cod_grupoempresa);

        const shuffledGroups = codGrupos.sort(() => Math.random() - 0.5);

        const listaGrupos = [];
        
        // Asignar evaluadores y evaluados de forma aleatoria
        for (let i = 0; i < shuffledGroups.length; i++) {
            const evaluador = shuffledGroups[i];
            const evaluado = shuffledGroups[(i + 1) % shuffledGroups.length];
            
            // Asegurarse de que un grupo no se evalúe a sí mismo
            if (evaluador !== evaluado) {
                listaGrupos.push({ evaluador, evaluado });
            }
        }
        return listaGrupos;
    }  catch (err) {
        console.error('Error al crear lista de grupos', err);
        throw err;
    }
};

const getGrupoAEvaluar = async (codigoSis, codClase) => {
    try {
        const codGrupo = await grupoEstudianteService.getCodGrupo(codigoSis, codClase);
        console.log(codGrupo);
        const result = await pool.query(
            `SELECT grupo_evaluado FROM evaluacion_cruzada WHERE grupo_evaluador = $1`,
                [codGrupo]
            );
        const codGrupoAEvaluar = result.rows[0].grupo_evaluado;
        const grupoAEvaluar = await grupoEmpresaService.getGrupoEmpresa(codGrupoAEvaluar);
        return grupoAEvaluar; 
    }  catch (err) {
        console.error('Error al obtener el grupo a evaluar', err);
        throw err;
    }
};

module.exports = {
    registrarEvalCruzada,
    getGrupoAEvaluar,
};
