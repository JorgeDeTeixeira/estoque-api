const pool = require("../config/db");

const Item = {
  // Cria um novo item
  async createItem(nome, quantidade, descricao, preco, estoqueId) {
    try {
      const [result] = await pool.query(
        "INSERT INTO itens (nome, quantidade, descricao, preco, estoque_id) VALUES (?, ?, ?, ?,?)",
        [nome, quantidade, descricao, preco, estoqueId]
      );
      return result;
    } catch (error) {
      console.log("Erro ao criar item:", error.message);
      throw new Error("Erro ao criar o item");
    }
  },

  // Busca todos os itens
  async findAllItems() {
    try {
      const [rows] = await pool.query("SELECT * FROM itens");
      return rows;
    } catch (error) {
      console.log("Erro ao buscar itens:", error.message);
      throw new Error("Erro ao buscar itens");
    }
  },

  // Busca um item pelo id
  async findItemById(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM itens WHERE id = ?", [id]);
      return rows[0];
    } catch (error) {
      console.log("Erro ao buscar item:", error.message);
      throw new Error("Erro ao buscar item");
    }
  },

  // Busca um item pelo estoque
  async findItemsByEstoqueId(estoqueId) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM itens WHERE estoque_id = ?",
        [estoqueId]
      );
      return rows;
    } catch (error) {
      console.log("Erro ao buscar itens pelo id do estoque", error.message);
      throw new Error("Erro ao buscar itens pelo id do estoque");
    }
  },

  // Busca o estoque de um item pelo id do item
  async findEstoqueByItemId(itemId) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM estoques WHERE id = (SELECT estoque_id FROM itens WHERE id = ?)",
        [itemId]
      );
      return rows;
    } catch (error) {
      console.log("Erro ao buscar estoque pelo id do item", error.message);
      throw new Error("Erro ao buscar estoque pelo id do item");
    }
  },

  // Verifica a passo do estoque pelo id do estoque e id do usuário
  async checkEstoqueOwnership(estoqueId, usuarioId) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM estoques WHERE id = ? AND usuario_id = ?",
        [estoqueId, usuarioId]
      );
      return rows;
    } catch (error) {
      console.log("Erro ao verificar posso do estoque:", error.message);
      throw new Error("Erro ao verificar posso do estoque");
    }
  },

  // Atualiza um item
  async updateItem(id, nome, quantidade, descricao, preco) {
    try {
      const [result] = await pool.query(
        "UPDATE itens SET nome = ?, quantidade = ?, descricao = ?, preco = ? WHERE id = ?",
        [nome, quantidade, descricao, preco, id]
      );
      return result;
    } catch (error) {
      console.log("Erro ao atualizar item:", error.message);
      throw new Error("Erro ao atualizar item");
    }
  },

  // Deleta um item
  async deleteItem(id) {
    try {
      const [result] = await pool.query("DELETE FROM itens WHERE id = ?", [id]);
      return result;
    } catch (error) {
      console.log("Erro ao deletar item:", error.message);
      throw new Error("Erro ao deletar item");
    }
  },
};

module.exports = Item;
