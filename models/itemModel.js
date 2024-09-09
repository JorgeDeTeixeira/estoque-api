const pool = require("../config/db");

const Item = {
  async create(nome, quantidade, descricao, preco, estoque_id) {
    const [result] = await pool.query(
      "INSERT INTO itens (nome, quantidade, descricao, preco, estoque_id) VALUES (?, ?, ?, ?, ?)",
      [nome, quantidade, descricao, preco, estoque_id]
    );
    return result;
  },

  async findAll() {
    const [rows] = await pool.query("SELECT * FROM itens");
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM itens WHERE id = ?", [id]);
    return rows[0];
  },

  async findByEstoque(estoque_id) {
    const [rows] = await pool.query(
      "SELECT * FROM itens WHERE estoque_id = ?",
      [estoque_id]
    );
    return rows;
  },

  async findEstoqueByUserId(usuarioId) {
    const [rows] = await pool.query(
      "SELECT * FROM estoques WHERE usuario_id = ?",
      [usuarioId]
    );
    return rows;
  },

  async findEstoqueByItemId(itemId) {
    const [rows] = await pool.query(
      "SELECT * FROM estoques WHERE id = (SELECT estoque_id FROM itens WHERE id = ?)",
      [itemId]
    );
    return rows;
  },

  async checkEstoqueOwnership(estoque_id, usuarioId) {
    const [rows] = await pool.query(
      "SELECT * FROM estoques WHERE id = ? AND usuario_id = ?",
      [estoque_id, usuarioId]
    );
    return rows;
  },

  async update(id, nome, quantidade, descricao, preco) {
    const [result] = await pool.query(
      "UPDATE itens SET nome = ?, quantidade = ?, descricao = ?, preco = ? WHERE id = ?",
      [nome, quantidade, descricao, preco, id]
    );
    return result;
  },

  async delete(id) {
    const [result] = await pool.query("DELETE FROM itens WHERE id = ?", [id]);
    return result;
  },
};

module.exports = Item;
