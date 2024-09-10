const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken, isAdmin } = require("../middleware/auth");

// Rota para registrar um usuário
router.post("/register", authenticateToken, isAdmin, userController.register);
// Rota para fazer login
router.post("/login", userController.login);

// Rota de admim para deleter um usuário
router.delete("/:id", authenticateToken, isAdmin, userController.delete);

module.exports = router;
