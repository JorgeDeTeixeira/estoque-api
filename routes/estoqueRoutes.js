const express = require("express");
const router = express.Router();
const estoqueController = require("../controllers/estoqueController");
const { authenticateToken, isAdmin } = require("../middleware/auth");

// Rota para acessar um estoque | Acesso: Público
router.get("/:id", authenticateToken, estoqueController.findById);

// Rota para criar, listar, atualizar e deletar um estoque | Acesso: Admin
router.post("/", authenticateToken, isAdmin, estoqueController.create);
router.get("/", authenticateToken, isAdmin, estoqueController.findAll);
router.put("/:id", authenticateToken, isAdmin, estoqueController.update);
router.delete("/:id", authenticateToken, isAdmin, estoqueController.delete);

module.exports = router;
