const express = require("express");
const router = express.Router();
const estoqueController = require("../controllers/estoqueController");
const { authenticateToken, isAdmin } = require("../middleware/auth");

// Rota para acessar um estoque
// Verifica se o estoque pertence ao usuário logado ou se o usuário é um admin
router.get("/:id", authenticateToken, estoqueController.findById);

// Rota para criar um estoque | Acesso: Admin
router.post("/", authenticateToken, isAdmin, estoqueController.create);

// Rota para listar todos os estoques | Acesso: Admin
router.get("/", authenticateToken, isAdmin, estoqueController.findAll);

// Rota para atualizar um estoque | Acesso: Admin
router.put("/:id", authenticateToken, isAdmin, estoqueController.update);

// Rota para deletar um estoque | Acesso: Admin
router.delete("/:id", authenticateToken, isAdmin, estoqueController.delete);

module.exports = router;
