const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET environment variable is not set");
}

// Middleware para autenticação de token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não informado" });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }
    req.user = user;
    next();
  });
}

// Middleware para verificar se o usuário é admin
function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(403).json({ message: "Usuário não autenticado" });
  }

  if (req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({
        message:
          "Acesso negado. Apenas administradores podem acessar esta rota",
      });
  }
}

module.exports = { authenticateToken, isAdmin };
