const express = require("express");
const router = express.Router();
const estoqueController = require("../controllers/estoqueController");
//const { authenticateToken } = require("../middlewares/authMiddleware");

//router.use(authenticateToken);

router.post("/", estoqueController.create);
router.get("/", estoqueController.findAll);
router.get("/:id", estoqueController.findById);
router.put("/:id", estoqueController.update);
router.delete("/:id", estoqueController.delete);

module.exports = router;
