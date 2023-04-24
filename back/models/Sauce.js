// Importation des modules nécessaires
const mongoose = require('mongoose');
const sanitize = require('mongoose-sanitizer-plugin');

// Création du schéma pour les sauces
const saucesSchema = mongoose.Schema({
    userId: { type: String, required: true }, // Champ pour l'ID de l'utilisateur qui a créé la sauce, obligatoire
    name: { type: String, required: true }, // Champ pour le nom de la sauce, obligatoire
    manufacturer: { type: String, required: true }, // Champ pour le fabricant de la sauce, obligatoire
    description: { type: String, required: true }, // Champ pour la description de la sauce, obligatoire
    imageUrl: { type: String, required: true }, // Champ pour l'URL de l'image de la sauce, obligatoire
    mainPepper: { type: String, required: true }, // Champ pour le principal ingrédient de la sauce, obligatoire
    heat: { type: Number, required: true }, // Champ pour la force de la sauce, obligatoire
    likes: { type: Number, default: 0 }, // Champ pour le nombre de likes de la sauce, initialisé à 0 par défaut
    dislikes: { type: Number, default: 0 }, // Champ pour le nombre de dislikes de la sauce, initialisé à 0 par défaut
    usersLiked: { type: [String] }, // Champ pour les utilisateurs ayant liké la sauce, initialisé à un tableau vide
    usersDisliked: { type: [String] } // Champ pour les utilisateurs ayant disliké la sauce, initialisé à un tableau vide
});

saucesSchema.plugin(sanitize); // Ajout du plugin mongoose-sanitizer-plugin pour nettoyer les champs de la sauce des caractères spéciaux et dangereux

module.exports = mongoose.model('Sauce', saucesSchema); // Exportation du modèle pour pouvoir l'utiliser dans d'autres fichiers
