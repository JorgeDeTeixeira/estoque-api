const Item = require("../models/itemModel");
const pool = require("../config/db");

const itemController = {
  async create(req, res) {
    try {
      const { nome, quantidade, descricao, preco } = req.body;
      const usuarioId = req.user.id; // Pega o id do usuário logado

      // Verifica se o estoque_id informado existe
      const [estoque] = await pool.query(
        "SELECT * FROM estoques WHERE id = ?",
        [usuarioId]
      );
      if (!estoque.length) {
        return res
          .status(404)
          .json({ message: "Estoque não encontrado para esse usuário." });
      }

      const estoque_id = estoque[0].id; // Pega o estoque do usuário logado

      const result = await Item.create(
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
      const items = await Item.findAll();
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
      const item = await Item.findById(id);
      if (item) {
        res.status(200).json(item);
      } else {
        res.status(404).json({ message: "Item not found" });
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
      const items = await Item.findByEstoque(estoque_id);
      console.log(items);
      if (items.length) {
        res.status(200).json(items);
      } else {
        res.status(400).json({ message: "No items found for this stokc" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error getting items", error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, quantidade, descricao, preco } = req.body;
      const result = await Item.update(id, nome, quantidade, descricao, preco);
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
      const result = await Item.delete(id);
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
