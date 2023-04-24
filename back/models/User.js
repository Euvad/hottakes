// Importation des modules nécessaires
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Création du schéma pour les utilisateurs
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Champ pour l'adresse email de l'utilisateur, obligatoire et unique
    password: { type: String, required: true } // Champ pour le mot de passe de l'utilisateur, obligatoire
});

userSchema.plugin(uniqueValidator); // Ajout du plugin mongoose-unique-validator pour vérifier que l'adresse email est unique

module.exports = mongoose.model('User', userSchema); // Exportation du modèle pour pouvoir l'utiliser dans d'autres fichiers
