const Estoque = require("../models/estoqueModel");
const Item = require("../models/itemModel");

const estoqueController = {
  async create(req, res) {
    try {
      const { nome, localizacao, usuario_id } = req.body;
      const usuarioAdmin = req.user.role; // Obtendo o role do usuário logado

      // Verifica se o usuário já possui estoque
      const existingEstoque = await Estoque.findByUserId(usuario_id);

      if (existingEstoque.length > 0) {
        return res.status(403).json({ message: "User already has a stock" });
      }

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
      const estoqueComItens = await Promise.all(
        estoques.map(async (estoque) => {
          const itens = await Item.findByEstoque(estoque.id);
          return { ...estoque, itens };
        })
      );
      res.status(200).json(estoqueComItens);
    } catch (erro) {
      res.status(500).json({ message: "Error fetching stocks", erro });
    }
  },

  async findById(req, res) {
    try {
      const { id } = req.params;
      const usuarioId = req.user.id; // Obtendo o id do usuário logado
      const usuarioAdmin = req.user.role; // Obtendo o role do usuário logado

      // Encontre o estoqueb pelo id
      const estoque = await Estoque.findById(id);

      if (!estoque) {
        return res.status(401).json({ message: "Stock not found" });
      }

      // Verifique se o estoque pertence ao usuário logado ou se o usuário é um admin
      if (estoque.usuario_id !== usuarioId && usuarioAdmin !== "admin") {
        return res
          .status(403)
          .json({ message: "Access denied. Stock does not belong to user" });
      }
      const itens = await Item.findByEstoque(id);
      return res.status(200).json({ ...estoque, itens });
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
        res.status(200).json({ message: "Stock deleted successfully" });
      } else {
        res.status(400).json({ message: "Stock not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting stock", error });
    }
  },
};

module.exports = estoqueController;
