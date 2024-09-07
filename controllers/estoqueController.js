const Estoque = require("../models/estoqueModel");

const estoqueController = {
  async create(req, res) {
    try {
      const { nome, localizacao, usuario_id } = req.body;
      const result = await Estoque.create(nome, localizacao, usuario_id);
      res
        .status(201)
        .json({ id: result.insertId, nome, localizacao, usuario_id });
    } catch (error) {
      res.status(500).json({ message: "Error creating stock", error });
    }
  },

  async findAll(req, res) {
    try {
      const estoques = await Estoque.findAll();
      res.status(200).json(estoques);
    } catch (erro) {
      res.status(500).json({ message: "Error fetching stocks", erro });
    }
  },

  async findById(req, res) {
    try {
      const { id } = req.params;
      const estoque = await Estoque.findById(id);
      if (estoque) {
        res.status(200).json(estoque);
      } else {
        res.status(401).json({ message: "Stock not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching stock", error });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, localizacao } = req.body;
      const result = await Estoque.update(id, nome, localizacao);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Stock updated successfully" });
      } else {
        res.status(401).json({ message: "Stock not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating stock", error });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await Estoque.delete(id);
      if (result.affectedRows > 0) {
        res.status(204).json({ message: "Stock deleted successfully" });
      } else {
        res.status(401).json({ message: "Stock not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting stock", error });
    }
  },
};

module.exports = estoqueController;
