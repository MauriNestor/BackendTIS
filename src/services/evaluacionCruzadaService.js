const { pool } = require('../config/db');
const grupoEmpresaService = require('../services/grupoEmpresaService');

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

module.exports = {
    registrarEvalCruzada,
};
