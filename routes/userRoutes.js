const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Rota para registrar um usuário
router.post("/register", userController.register);

// Rota para fazer login
router.post("/login", userController.login);

module.exports = router;
