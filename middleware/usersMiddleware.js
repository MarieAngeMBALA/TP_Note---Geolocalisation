const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userData = { userId: decodedToken.userId, username: decodedToken.username };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentification échouée' });
  }
};