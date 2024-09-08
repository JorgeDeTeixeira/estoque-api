const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken, isAdmin } = require("../middleware/auth");

// Rota para registrar um usuário
router.post("/register", authenticateToken, isAdmin, userController.register);
// Rota para fazer login
router.post("/login", userController.login);

module.exports = router;
