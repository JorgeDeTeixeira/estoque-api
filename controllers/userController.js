const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const userController = {
  async register(req, res) {
    const { username, password } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    try {
      // Gera um hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      //Salva o usuário no banco de dados com a senha criptografada
      const result = await User.create(username, hashedPassword);
      res.status(201).json({ id: result.insertId, username });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error registering user", error: error.message });
    }
  },

  async login(req, res) {
    const { username, password } = req.body;

    // Busca o usuário no banco de dados
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verifica se a senha está correta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return res.json({ token });
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await User.delete(id);
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: "User deleted successfully" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error deleting user", erro: error.message });
    }
  },
};

module.exports = userController;
