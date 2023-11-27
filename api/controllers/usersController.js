const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/usersModel');


//Génerer un refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d' }); 
};

// créer un utilisateur
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Nom d\'utilisateur ou adresse e-mail déjà utilisé' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({ username, email, password: hashedPassword });

    // Générer un token JWT avec la clé secrète d'accès
    const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    newUser.token = accessToken;

    // Générer un refresh token
    const refreshToken = generateRefreshToken(newUser._id);
    newUser.refreshToken = refreshToken;

    // Sauvegarder l'utilisateur dans la base de données
    const savedUser = await newUser.save();

     // Ne pas renvoyer le mot de passe encrypté dans la réponse
     const userResponse = {
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
    };

    res.status(201).json({ user: userResponse});
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur :', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
};


// Se connecter
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Trouver l'utilisateur dans la base de données
    const user = await User.findOne({ username });

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    // Générer un token JWT avec la clé secrète d'accès
    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    // Générer un refresh token
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({ accessToken, refreshToken});
  } catch (error) {
    console.error('Erreur lors de l\'authentification de l\'utilisateur :', error);
    res.status(500).json({ error: 'Erreur lors de l\'authentification de l\'utilisateur' });
  }
};

