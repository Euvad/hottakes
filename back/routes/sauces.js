// Importation des modules nécessaires
const express = require('express');
const router = express.Router(); // Création du routeur pour gérer les routes relatives aux sauces
const sauceCtrl = require('../controllers/sauce'); // Importation du contrôleur pour les sauces
const auth = require('../middleware/auth'); // Importation du middleware d'authentification
const multer = require('../middleware/multer-config'); // Importation du middleware de configuration de multer

// Définition des différentes routes pour les sauces
router.post('/', auth, multer, sauceCtrl.createSauce); // Route pour créer une sauce, avec middleware d'authentification et de configuration de multer
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Route pour modifier une sauce, avec middleware d'authentification et de configuration de multer
router.delete('/:id', auth, multer, sauceCtrl.deleteSauce); // Route pour supprimer une sauce, avec middleware d'authentification et de configuration de multer
router.post('/:id/like', auth, sauceCtrl.likeOrDislike); // Route pour ajouter ou retirer un like sur une sauce, avec middleware d'authentification
router.get('/', auth, sauceCtrl.getAllSauces); // Route pour récupérer toutes les sauces, avec middleware d'authentification
router.get('/:id', auth, sauceCtrl.getOneSauce); // Route pour récupérer une sauce spécifique, avec middleware d'authentification

module.exports = router; // Exportation du routeur pour pouvoir l'utiliser dans d'autres fichiers
