// Importation des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Pour charger les variables d'environnement
const app = express(); // Création de l'application express
const path = require('path'); // Pour manipuler les chemins de fichier
const bodyParser = require('body-parser'); // Pour traiter les données envoyées dans le corps des requêtes HTTP
const cookieParser = require('cookie-parser'); // Pour traiter les cookies envoyés par les navigateurs web
const userRoutes = require('./routes/user'); // Importation des routes pour les utilisateurs
const sauceRoutes = require('./routes/sauces'); // Importation des routes pour les sauces

// Récupération des informations de connexion à la base de données MongoDB depuis les variables d'environnement
const db_user = process.env.DB_USERNAME;
const db_pass = process.env.DB_PASSWORD;

// Connexion à la base de données MongoDB
mongoose.connect(`mongodb+srv://${db_user}:${db_pass}@piquante.h1ncn8a.mongodb.net/test`, {
  useNewUrlParser: true, // Pour éviter les erreurs de connexion
  useUnifiedTopology: true // Pour éviter les avertissements de dépréciation
})
  .then(() => console.log('Connexion à MongoDB réussie !')) // En cas de succès de la connexion
  .catch(() => console.log('Connexion à MongoDB échouée !')); // En cas d'échec de la connexion

// Configuration de l'application express
app.use(express.json()); // Pour traiter les données envoyées dans le corps des requêtes HTTP au format JSON
app.use((req, res, next) => { // Pour définir les en-têtes HTTP pour toutes les requêtes
  res.setHeader('Access-Control-Allow-Origin', '*'); // Pour autoriser toutes les origines à accéder à l'API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Pour autoriser certains en-têtes HTTP
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Pour autoriser certaines méthodes HTTP
  next();
});
app.use(bodyParser.json()); // Pour traiter les données envoyées dans le corps des requêtes HTTP au format JSON
app.use(cookieParser()); // Pour traiter les cookies envoyés par les navigateurs web
app.use('/images', express.static(path.join(__dirname, 'images'))); // Pour servir les fichiers d'images statiques
app.use('/api/sauces', sauceRoutes); // Pour utiliser les routes pour les sauces
app.use('/api/auth', userRoutes); // Pour utiliser les routes pour les utilisateurs

module.exports = app; // Exportation de l'application express pour l'utiliser dans d'autres fichiers
