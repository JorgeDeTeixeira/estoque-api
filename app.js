const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const estoqueRoutes = require("./routes/estoqueRoutes");
const itensRoutes = require("./routes/itemRoutes");

dotenv.config();

const app = express();

// Middleware para tratar o Json
app.use(express.json());

// Rotas
app.use("/api/users", userRoutes);
app.use("/api/estoques", estoqueRoutes);
app.use("/api/itens", itensRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
