const { pool } = require('../config/db');

const registrarTema = async (tema, codClase, codDocente) => {
    try {

        const temaAceptado = await verificarTema(tema, codClase);
        let codTema;
        if (temaAceptado) {
            const result = await pool.query(
                'INSERT INTO Tema (cod_docente, cod_clase, nombre_tema) VALUES ($1, $2, $3) RETURNING *;',
                [codDocente, codClase, tema]
            );
            codTema = codTema = result.rows[0].cod_tema;
            return codTema;
        } else {
            const result = await pool.query(
                'SELECT cod_tema FROM Tema WHERE nombre_tema = $1 AND cod_clase = $2',
                [tema, codClase]
            );
            codTema = codTema = result.rows[0].cod_tema;
            return codTema;
        }; 

    }  catch (err) {
        console.error('Error al registrar tema', err);
        throw err;
    }
};

const verificarTema = async (tema, codClase) => {
    try {
        const result = await pool.query(
            'SELECT * FROM Tema WHERE nombre_tema = $1 AND cod_clase = $2',
            [tema, codClase]
        );        

        if (result.rows.length === 0) {
            return true;
          } else {
            return false;
          }
    }  catch (err) {
        console.error('Error al verificar el tema', err);
        throw err;
    }
};

const getTema = async (codClase) => {
    try {
        const result = await pool.query(
            'SELECT nombre_tema FROM Tema  WHERE  cod_clase = $1',
            [codClase]
        );

        const temas = result.rows;
        return temas;
    }  catch (err) {
        console.error('Error al registrar tema', err);
        throw err;
    }
};

module.exports = {
    registrarTema,
    getTema,
    
};
