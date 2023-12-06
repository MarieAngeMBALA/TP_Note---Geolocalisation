const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token manquant. Vous devez être authentifié pour effectuer cette action.' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); //
    // Ajouter les informations de l'utilisateur à l'objet de requête
    req.user = {
      userId: decodedToken.userId,
      username: decodedToken.username
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide.' });
  }
};

module.exports = verifyToken;
