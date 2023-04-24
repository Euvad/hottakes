// Importation des modules nécessaires
const express = require('express');
const auth = require('../middleware/auth'); // Importation du middleware d'authentification
const multer = require('../middleware/multer-config'); // Importation du middleware de configuration de multer
const router = express.Router(); // Création du routeur pour gérer les routes relatives aux utilisateurs
const userCtrl = require('../controllers/user'); // Importation du contrôleur pour les utilisateurs

router.post('/signup', userCtrl.signup); // Route pour l'inscription des utilisateurs, sans middleware d'authentification
router.post('/login', userCtrl.login); // Route pour la connexion des utilisateurs, sans middleware d'authentification

module.exports = router; // Exportation du routeur pour pouvoir l'utiliser dans d'autres fichiers
