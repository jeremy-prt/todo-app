const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Route pour s'inscrire
router.post("/signup", async (req, res) => {
  const { email, password, display_name } = req.body;

  if (!email || !password || !display_name) {
    return res
      .status(400)
      .json({ message: "Champs email, password, display_name sont requis" });
  }

  const user = await User.build({
    email: email,
    password: password,
    display_name,
  });

  try {
    await user.validate({ fields: ["email"] });
  } catch (error) {
    res.status(500);
    res.json({ message: "Votre email n'est pas valide" });
    return;
  }

  try {
    await user.save();
    res.status(201).json({
      message: `Utilisateur créé avec succès. Bienvenue ${user.display_name}`,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ message: "Cet email est déjà utilisé" });
    } else {
      res
        .status(500)
        .json({ message: "Erreur inattendue", error: error.message });
    }
  }
});

// Route pour se connecter
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Les champs email et password sont requis" });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Générer le token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: `Bienvenue ${user.display_name}`,
      token,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur inattendue lors de la connexion" });
  }
});

module.exports = router;
