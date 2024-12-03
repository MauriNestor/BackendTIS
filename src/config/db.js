const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  //  ssl: {
  //       rejectUnauthorized: true,
  //       ca: fs.readFileSync(path.join(__dirname, 'ca-certificate.crt')).toString(),
  //   },
  //   max: 10, // Número máximo de conexiones en el pool
  //   idleTimeoutMillis: 30000, // Tiempo antes de cerrar conexiones inactivas
  //   connectionTimeoutMillis: 2000, // Tiempo para establecer una conexión antes de dar timeout
});

// Conectar a la base de datos
pool.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.stack);
  } else {
    console.log("Conexión a la base de datos exitosa");
  }
});

module.exports = { pool };
