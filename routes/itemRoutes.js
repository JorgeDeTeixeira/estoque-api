const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const { authenticateToken, isAdmin } = require("../middleware/auth");

// Rotas de CRUD de itens

// Criar um item | Acesso: Usuário autenticado
router.post("/", authenticateToken, itemController.create);

// Listar todos os itens | Acesso: Admin
router.get("/", authenticateToken, isAdmin, itemController.findAll);

// Buscar item por ID | Acesso: Usuário autenticado
router.get("/:id", authenticateToken, itemController.findById);

// Buscar itens por estoque | Acesso: Usuário autenticado
router.get(
  "/estoque/:estoque_id",
  authenticateToken,
  itemController.findByEstoque
);

// Atualizar um item | Acesso: Usuário autenticado (verificar se o item pertence ao usuário)
router.put("/:id", authenticateToken, itemController.update);

// Deletar um item | Acesso: Usuário autenticado (verificar se o item pertence ao usuário)
router.delete("/:id", authenticateToken, itemController.delete);

module.exports = router;
