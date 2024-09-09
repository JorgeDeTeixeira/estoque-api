const pool = require("../config/db");

const Estoque = {
  // Cria um novo estoque
  async createStock(nome, localizacao, usuarioId) {
    try {
      const [result] = await pool.query(
        "INSERT INTO estoques (nome, localizacao, usuario_id) VALUES (?, ?, ?)",
        [nome, localizacao, usuarioId]
      );
      return result;
    } catch (error) {
      console.log("Erro ao criar estoque", error.message);
      throw new Error("Erro ao criar estoque");
    }
  },

  // Busca todos os estoques
  async findAllStocks() {
    try {
      const [rows] = await pool.query("SELECT * FROM estoques");
      return rows;
    } catch (error) {
      console.error("Erro ao buscar estoques", error.message);
      throw new Error("Erro ao buscar estoques");
    }
  },

  // Busca um estoque pelo id
  async findStockById(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM estoques WHERE id = ?", [
        id,
      ]);
      return rows[0];
    } catch (error) {
      console.error("Erro ao buscar estoque pelo id", error.message);
      throw new Error("Erro ao buscar estoque pelo id");
    }
  },

  // Encontra um estoque pelo id do usuário
  async findStocksByUserId(usuarioId) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM estoques WHERE usuario_id = ?",
        [usuarioId]
      );
      return rows;
    } catch (error) {
      console.error(
        "Erro ao buscar estoques pelo id do usuário",
        error.message
      );
      throw new Error("Erro ao buscar estoques pelo id do usuário");
    }
  },

  async updateStock(id, nome, localizacao) {
    try {
      const [result] = await pool.query(
        "UPDATE estoques SET nome = ?, localizacao = ? WHERE id =?",
        [nome, localizacao, id]
      );
      return result;
    } catch (error) {
      console.error("Erro ao atualizar estoque:", error.message);
      throw new Error("Erro ao atualizar estoque");
    }
  },

  // Deleta um estoque
  async deleteStock(id) {
    try {
      const [result] = await pool.query("DELETE FROM estoques WHERE id = ?", [
        id,
      ]);
      return result;
    } catch (error) {
      console.error("Erro ao deletar estoque:", error.message);
      throw new Error("Erro ao deletar estoque");
    }
  },
};

module.exports = Estoque;
