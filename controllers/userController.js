const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const userController = {
  // Regista um novo usuário
  async register(req, res) {
    const { username, password } = req.body;

    // Valida a entrada
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username e password são obrigatórios" });
    }

    try {
      // Verifica se o usuário já existe
      const existingUser = await User.findUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Usuário já existe" });
      }

      const result = await User.createUser(username, password);
      res.status(201).json({
        message: "Usuário criado com sucesso",
        id: result.insertId,
        username,
      });
    } catch (error) {
      console.error("Erro ao criar usuário", error.message);
      res
        .status(500)
        .json({ message: "Erro ao criar usuário", error: error.message });
    }
  },

  // Faz o login do usuario
  async login(req, res) {
    const { username, password } = req.body;

    // Valida a entrada
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username e password são obrigatórios" });
    }

    try {
      // Busca o usuário no banco de dados
      const user = await User.findUserByUsername(username);
      if (!user) {
        return res.status(400).json({ message: "Username inválido" });
      }

      // Verifica se a senha está correta
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Passwordo inválido" });
      }

      // Gera o token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        message: `Login realizado com sucesso, bem vindo ${user.username}!`,
        token,
      });
    } catch (error) {
      console.error("Erro ao fazer login", error.message);
      res
        .status(500)
        .json({ message: "Erro ao fazer login", error: error.message });
    }
  },

  // Deleta um usuário
  async delete(req, res) {
    const { id } = req.params;

    // Valida a entrada
    if (!id) {
      return res.status(400).json({ message: "ID é obrigatório" });
    }

    try {
      const result = await User.deleteByUserId(id);
      if (result.affectedRows > 0) {
        return res.status(204).send();
      } else {
        return res.json({ message: "Usuário não encontrado" });
      }
    } catch (error) {
      console.error("Erro ao deletar usuário", error.message);
      res
        .status(500)
        .json({ message: "Erro ao deletar usuário", error: error.message });
    }
  },
};

module.exports = userController;
