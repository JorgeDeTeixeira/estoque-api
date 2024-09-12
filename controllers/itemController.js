const Item = require("../models/itemModel");
const Estoque = require("../models/estoqueModel");

const itemController = {
  // Cria um item
  async create(req, res) {
    const { nome, quantidade, descricao, preco } = req.body;
    const usuarioId = req.user.id;

    // Validação de entradas
    if (!nome || !quantidade || !descricao || !preco) {
      return res.status(400).json({
        message: "Nome, quantidade, descrição e preço são obrigatórios",
      });
    }

    try {
      const estoques = await Estoque.findStocksByUserId(usuarioId);
      if (estoques.length === 0) {
        return res
          .status(404)
          .json({ message: "Estoque não encontrado para esse usuário." });
      }

      const estoque_id = estoques[0].id;
      const result = await Item.createItem(
        nome,
        quantidade,
        descricao,
        preco,
        estoque_id
      );

      res.status(201).json({
        message: "Item criado com sucesso",
        id: result.insertId,
        nome,
        quantidade,
        descricao,
        preco,
        estoque_id,
      });
    } catch (error) {
      console.error("Erro ao criar item:", error.message);
      res
        .status(500)
        .json({ message: "Erro ao criar o item", error: error.message });
    }
  },

  // Lista todos os itens
  async findAll(req, res) {
    try {
      const items = await Item.findAllItems();
      res.status(200).json(items);
    } catch (error) {
      console.error("Erro ao buscar os itens:", error.message);
      res
        .status(500)
        .json({ message: "Erro ao buscar os itens", error: error.message });
    }
  },

  // Busca item por ID
  async findById(req, res) {
    const { id } = req.params;
    try {
      const item = await Item.findItemById(id);
      if (!item) {
        return res.status(404).json({ message: "Item não encontrado" });
      }

      const estoques = await Item.findEstoqueByItemId(id);
      if (estoques.length === 0 || estoques[0].usuario_id !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Você não tem permissão para acessar esse item" });
      }

      res.status(200).json(item);
    } catch (error) {
      console.error("Erro ao encontrar item:", error.message);
      res
        .status(500)
        .json({ message: "Erro ao encontrar item", error: error.message });
    }
  },

  // Busca itens por estoque
  async findByEstoque(req, res) {
    const { estoque_id } = req.params;
    const usuarioId = req.user.id;

    try {
      const estoque = await Item.checkEstoqueOwnership(estoque_id, usuarioId);
      if (estoque.length === 0) {
        return res
          .status(403)
          .json({ message: "Estoque não encontrado para esse usuário." });
      }

      const items = await Item.findItemsByEstoqueId(estoque_id);
      if (items.length > 0) {
        res.status(200).json(items);
      } else {
        res
          .status(404)
          .json({ message: "Nenhum item encontrado para este estoque" });
      }
    } catch (error) {
      console.error("Erro ao buscar itens:", error.message);
      res
        .status(500)
        .json({ message: "Erro ao buscar itens", error: error.message });
    }
  },

  // Atualiza um item
  async update(req, res) {
    const { id } = req.params;
    const { nome, quantidade, descricao, preco } = req.body;
    const usuarioId = req.user.id;

    if (!nome || !quantidade || !descricao || !preco) {
      return res.status(400).json({
        message: "Nome, quantidade, descrição e preço são obrigatórios",
      });
    }

    try {
      const item = await Item.findItemById(id);
      if (!item) {
        return res.status(404).json({ message: "Item não encontrado" });
      }

      const estoque = await Item.checkEstoqueOwnership(
        item.estoque_id,
        usuarioId
      );
      if (estoque.length === 0) {
        return res
          .status(403)
          .json({ message: "Você não tem permissão para alterar esse item" });
      }

      const result = await Item.updateItem(
        id,
        nome,
        quantidade,
        descricao,
        preco
      );
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Item atualizado com sucesso" });
      } else {
        res.status(404).json({ message: "Item não encontrado" });
      }
    } catch (error) {
      console.error("Erro ao atualizar item:", error.message);
      res
        .status(500)
        .json({ message: "Erro ao atualizar o item", error: error.message });
    }
  },

  // Deleta um item
  async delete(req, res) {
    const { id } = req.params;
    const usuarioId = req.user.id;

    try {
      const item = await Item.findItemById(id);
      if (!item) {
        return res.status(404).json({ message: "Item não encontrado" });
      }

      const estoque = await Item.checkEstoqueOwnership(
        item.estoque_id,
        usuarioId
      );
      if (estoque.length === 0) {
        return res
          .status(403)
          .json({ message: "Você não tem permissão para deletar esse item" });
      }

      const result = await Item.deleteItem(id);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Item deletado com sucesso" });
      } else {
        res.status(404).json({ message: "Item não encontrado" });
      }
    } catch (error) {
      console.error("Erro ao deletar item:", error.message);
      res
        .status(500)
        .json({ message: "Erro ao deletar o item", error: error.message });
    }
  },
};

module.exports = itemController;
