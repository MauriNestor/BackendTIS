require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
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
