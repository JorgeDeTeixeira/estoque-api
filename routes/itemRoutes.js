const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const { authenticateToken, isAdmin } = require("../middleware/auth");

// Rotas de crud de itens
router.post("/", authenticateToken, itemController.create);
router.get("/", authenticateToken, isAdmin, itemController.findAll);
router.get("/:id", authenticateToken, itemController.findById);
router.get("/estoque/:estoque_id", authenticateToken, itemController.findByEstoque);
router.put("/:id", authenticateToken, itemController.update);
router.delete("/:id", authenticateToken, itemController.delete);

module.exports = router;
