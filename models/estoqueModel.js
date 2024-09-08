const pool = require("../config/db");

const Estoque = {
  async create(nome, localizacao, usuario_id) {
    const [result] = await pool.query(
      "INSERT INTO estoques (nome, localizacao, usuario_id) VALUES (?, ?, ?)",
      [nome, localizacao, usuario_id]
    );
    return result;
  },

  async findAll() {
    const [rows] = await pool.query("SELECT * FROM estoques");
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM estoques WHERE id = ?", [
      id,
    ]);
    return rows[0];
  },

  async findByUserId(usuarioId) {
    const [rows] = await pool.query(
      "SELECT * FROM estoques WHERE usuario_id = ?",
      [usuarioId]
    );
    return rows;
  },

  async update(id, nome, localizacao) {
    const [result] = await pool.query(
      "UPDATE estoques set nome = ?, localizacao = ? WHERE id = ?",
      [nome, localizacao, id]
    );
    return result;
  },

  async delete(id) {
    const [result] = await pool.query("DELETE FROM estoques WHERE id = ?", [
      id,
    ]);
    return result;
  },
};

module.exports = Estoque;
