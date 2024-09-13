const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken, isAdmin } = require("../middleware/auth");

// Rota para registrar um usuário
// Apenas admin pode criar usuários
router.post("/register", authenticateToken, isAdmin, userController.register);

// Rota para fazer login
// Não requer autenticação
router.post("/login", userController.login);

// Rota para deletar um usuário
// Apenas admin pode deletar usuários
router.delete("/:id", authenticateToken, isAdmin, userController.delete);

module.exports = router;
