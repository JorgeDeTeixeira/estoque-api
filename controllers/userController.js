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

    // Criptragrafa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    await User.create(username, hashedPassword);

    return res.status(201).json({ message: "User registered successfully" });
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
};

module.exports = userController;
