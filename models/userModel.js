const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const saldRounds = 10;

const User = {
  // Cria um novo usuário
  async createUser(username, password, role = "user") {
    try {
      // Gera um hash da senha
      const hashedPassword = await bcrypt.hash(password, saldRounds);
      const [result] = await pool.query(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, hashedPassword, role]
      );
      return result;
    } catch (error) {
      console.error("Erro ao criar usuário:", error.message);
      throw new Error("Erro ao criar usuário");
    }
  },

  // Encontra um usuário pelo username
  async findUserByUsername(username) {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE username =?", [
        username,
      ]);
      return rows[0];
    } catch (error) {
      console.error("Erro ao encontrar usuário:", error.message);
      throw new Error("Erro ao encontrar usuário");
    }
  },
};

module.exports = User;
