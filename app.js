const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const estoqueRoutes = require("./routes/estoqueRoutes");
const itemRoutes = require("./routes/itemRoutes");

dotenv.config();

const app = express();

// Middleware para tratar o JSON
app.use(express.json());

// Middleware de logging (opcional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rotas
app.use("/api/users", userRoutes);
app.use("/api/estoques", estoqueRoutes);
app.use("/api/itens", itemRoutes);

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
