const db = require('../config/db');

const crearActividad = async (actividad, codigos, rubrica) => {
    try {
        const result = await pool.query(
            'INSERT INTO actividad (actividad, fecha_inicio, fecha_fin, descripcion_actividad, archivo_actividad) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [actividad.nombre, actividad.fechaInicio, actividad.fechaFin, actividad.descripcion, actividad.archivo]
        );
        codActividad = result.rows[0].cod_actividad;
        crearActividadGrupo(codActividad, codigos.codDocente, codigos.codClase, codigos.codigosGrupo);
        
    } catch (err) {
        console.error('Error al crear actividad', err);
        throw err;
    }
};

const crearActividadGrupo = async (codActividad, codDocente, codClase, codigosGrupo) => {
    try {
        for (const codGrupo of codigosGrupo) {
            await pool.query(
                'INSERT INTO actividad_grupo (cod_docente, cod_clase, cod_grupoempresa, cod_actividad) VALUES ($1, $2, $3, $4)',
                [codDocente, codClase, codGrupo, codActividad]
            );
        }
    } catch (err) {
        console.error('Error al crear actividad Grupo', err);
        throw err;
    }
};


module.exports = {
    crearActividad,
};
