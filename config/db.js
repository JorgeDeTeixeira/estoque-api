const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

// Função para validar se as variáveis de ambiente foram definidas
const validateEnvVariables = () => {
  const requiredVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
  requiredVars.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`Missing required environment variable: ${variable}`);
    }
  });
};

// Valida as variáveis de ambiente
validateEnvVariables();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Verifica se o pool está funcionando corretamente
pool
  .getConnection()
  .then(() => console.log("Connected to the database"))
  .catch((err) =>
    console.error("Failed to connect to the database", err).process.exit(1)
  );

module.exports = pool;
