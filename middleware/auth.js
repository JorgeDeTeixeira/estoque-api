const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secret = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não informado" });
  }

  // Verifica se o token é válido
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }
    req.user = user;
    next();
  });
}

// Middleware para verificar se  o usuário é admin
function isAdmin(req, res, next) {
  // Verifica se o usuário foi definido
  if (!req.user) {
    return res.status(403).json({ message: "User não autenticado" });
  }

  //Verifica o papel do usuário
  if (req.user.role === "admin") {
    next(); // Continua se for admin
  } else {
    return res.status(403).json({ message: "Acesso negado. Apenas usúarios autorizados" });
  }
}

module.exports = { authenticateToken, isAdmin };
