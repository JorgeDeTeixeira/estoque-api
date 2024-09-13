const Estoque = require("../models/estoqueModel");
const Item = require("../models/itemModel");

const estoqueController = {
  // Cria um novo estoque para o usuário
  async create(req, res) {
    const { nome, localizacao, usuarioId } = req.body;

    // Valida a entrada
    if (!nome) {
      return res.status(400).json({ message: "Nome é obrigatório" });
    }

    if (!localizacao) {
      return res.status(400).json({ message: "Localização é obrigatória" });
    }

    if (!usuarioId) {
      return res.status(400).json({
        message: "Usuário para ser relacionado ao estoque é obrigatório",
      });
    }

    try {
      // Verifica se o usuário já possui estoque
      const existingEstoque = await Estoque.findStocksByUserId(usuarioId);
      if (existingEstoque.length > 0) {
        return res
          .status(403)
          .json({ message: "Usuário já possui um estoque" });
      }

      const result = await Estoque.createStock(nome, localizacao, usuarioId);
      res
        .status(201)
        .json({ id: result.insertId, nome, localizacao, usuarioId });
    } catch (error) {
      console.error("Erro ao criar estoque", error.message);
      res
        .status(500)
        .json({ message: "Erro ao criar o estoque", error: error.message });
    }
  },

  // Busca todos os estoques com seus itens associados
  async findAll(req, res) {
    try {
      const estoques = await Estoque.findAllStocks();
      const estoqueComItens = await Promise.all(
        estoques.map(async (estoque) => {
          const itens = await Item.findItemsByEstoqueId(estoque.id);
          return { ...estoque, itens };
        })
      );
      return res.status(200).json(estoqueComItens);
    } catch (error) {
      console.log("Erro ao buscar todos os estoques ", error.message);
      res.status(500).json({
        message: "Erro ao buscar todos os estoques",
        error: error.message,
      });
    }
  },

  // Busca estoque por id
  async findById(req, res) {
    const { id } = req.params;
    const usuarioId = req.usuarioId;
    const usuarioAdmin = req.user.role;

    try {
      // Busca o estoque pelo id
      const estoque = await Estoque.findStockById(id);

      if (!estoque) {
        return res.status(404).json({ message: "Estoque não encontrado" });
      }

      // Verifique se o estoque pertence ao usuário logado ou se o usuário é um admin
      if (estoque.usuario_id !== usuarioId && usuarioAdmin !== "admin") {
        return res.status(403).json({
          message: "Acesso negado. O estoque não pertence ao usuário",
        });
      }
      const itens = await Item.findItemsByEstoqueId(id);

      return res.status(200).json({ ...estoque, itens });
    } catch (error) {
      console.error("Erro ao buscar estoque", error.message);
      res
        .status(500)
        .json({ message: "Erro ao buscar estoque", error: error.message });
    }
  },

  // Atualiza um estoque
  async update(req, res) {
    const { id } = req.params;
    const { nome, localizacao } = req.body;

    if (!nome) {
      return res.status(400).json({ message: "Nome é obrigatório" });
    }

    if (!localizacao) {
      return res.status(400).json({ message: "Localização é obrigatória" });
    }

    try {
      const result = await Estoque.updateStock(id, nome, localizacao);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Estoque atualizado com sucesso" });
      } else {
        res.status(404).json({ message: "Estoque não encontrado" });
      }
    } catch (error) {
      console.error("Erro ao atualizar estoque", error.message);
      res
        .status(500)
        .json({ message: "Erro ao atualizar o estoque", error: error.message });
    }
  },

  // Deleta um estoque
  async delete(req, res) {
    const { id } = req.params;
    try {
      const result = await Estoque.deleteStock(id);
      if (result.affectedRows > 0) {
        res.status(204).send();
      } else {
        res.status(400).json({ message: "Estoque não encontrado" });
      }
    } catch (error) {
      console.error("Erro ao deletar estoque", error.message);
      res
        .status(500)
        .json({ message: "Erro ao deletar estoque", error: error.message });
    }
  },
};

module.exports = estoqueController;
