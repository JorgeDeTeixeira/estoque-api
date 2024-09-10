const Item = require("../models/itemModel");

const itemController = {
  async create(req, res) {
    try {
      const { nome, quantidade, descricao, preco } = req.body;
      const usuarioId = req.user.id; // Pega o id do usuário logado

      // Verifica se o estoque_id informado existe
      const estoques = await Item.findEstoqueByUserId(usuarioId);
      if (estoques.length === 0) {
        return res
          .status(404)
          .json({ message: "Estoque não encontrado para esse usuário." });
      }

      const estoque_id = estoques[0].id; // Pega o estoque do usuário logado

      const result = await Item.createItem(
        nome,
        quantidade,
        descricao,
        preco,
        estoque_id
      );

      res.status(201).json({
        message: "Item created",
        id: result.insertId,
        nome,
        quantidade,
        descricao,
        preco,
        estoque_id,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating item", error: error.message });
    }
  },

  async findAll(req, res) {
    try {
      const items = await Item.findAllItems();
      res.status(200).json(items);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error getting items", error: error.message });
    }
  },

  async findById(req, res) {
    try {
      const { id } = req.params;
      const item = await Item.findItemById(id);

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      // Verifica se o item pertence ao usuário logado
      const estoques = await Item.findEstoqueByItemId(id);
      if (estoques.length === 0 || estoques[0].usuario_id !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Você não tem permissão para acessar esse item" });
      }

      if (item) {
        res.status(200).json(item);
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error getting item", error: error.message });
    }
  },

  async findByEstoque(req, res) {
    try {
      const { estoque_id } = req.params;
      const usuarioId = req.user.id; // Obtendo o id do usuário logado

      // Verifica se o estoque pertence ao usuário logado
      const estoque = await Item.checkEstoqueOwnership(estoque_id, usuarioId);

      if (!estoque.length) {
        return res
          .status(403)
          .json({ message: "Estoque não encontrado para esse usuário." });
      }

      // Se o estoque pertence ao usuário, busca os itens desse estoque
      const items = await Item.findItemsByEstoqueId(estoque_id);
      if (items.length) {
        res.status(200).json(items);
      } else {
        res
          .status(404)
          .json({ message: "Nenhum item encontrado para este estoque" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao buscar itens", error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, quantidade, descricao, preco } = req.body;
      const usuarioId = req.user.id; // Pega o id do usuário logado

      const item = await Item.findItemById(id);

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const estoque = await Item.checkEstoqueOwnership(
        item.estoque_id,
        usuarioId
      );

      if (!estoque.length) {
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
        res.status(200).json({ message: "Item updated" });
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating item", error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const usuarioId = req.user.id; // Pega o id do usuário logado

      const item = await Item.findItemById(id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const estoque = await Item.checkEstoqueOwnership(
        item.estoque_id,
        usuarioId
      );

      if (!estoque.length) {
        return res
          .status(403)
          .json({ message: "Você não tem permissão para deletar esse item" });
      }

      const result = await Item.deleteItem(id);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Item deleted" });
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting item", error: error.message });
    }
  },
};

module.exports = itemController;
