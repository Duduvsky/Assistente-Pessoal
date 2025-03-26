const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});

pool.query("SELECT NOW()", (err) => {
  if (err) {
    console.error("Erro de conexão:", err.stack);
  } else {
    console.log("Conexão bem sucedida com PostgreSQL!");
  }
});

module.exports = pool;
