const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
//const { authenticateToken } = require("../middlewares/authMiddleware");

//router.use(authenticateToken);

// Rotas de crud de itens
router.post("/", itemController.create);
router.get("/", itemController.findAll);
router.get("/:id", itemController.findById);
router.get("/estoque/:id", itemController.findByEstoque);
router.put("/:id", itemController.update);
router.delete("/:id", itemController.delete);

module.exports = router;
