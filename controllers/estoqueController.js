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
      const usuarioId = req.user.id; // Obtendo o id do usuário logado

      // Encontre o estoqueb pelo id
      const estoque = await Estoque.findById(id);

      if (!estoque) {
        return res.status(401).json({ message: "Stock not found" });
      }

      // Verifica se o estoque pertence ao usuário logado
      if (estoque.usuario_id !== usuarioId) {
        return res
          .status(403)
          .json({ message: "Access denied. Stock does not belong to user" });
      }

      return res.status(200).json(estoque);
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
