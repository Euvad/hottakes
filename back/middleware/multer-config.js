// Importation du module Multer pour la gestion des fichiers téléchargés.
const multer = require('multer');

// Définition des types MIME acceptés et des extensions correspondantes.
const MIME_TYPES = {
'image/jpg': 'jpg',
'image/jpeg': 'jpg',
'image/png': 'png'
};

// Configuration du stockage de fichiers à l'aide de la méthode diskStorage de Multer.
const storage = multer.diskStorage({
// Destination du fichier téléchargé.
destination: (req, file, callback) => {
callback(null, 'images');
},
// Nom du fichier téléchargé.
filename: (req, file, callback) => {
// On remplace les espaces dans le nom d'origine par des underscores pour éviter les erreurs.
const name = file.originalname.split(' ').join('');
// Récupération de l'extension à partir du type MIME du fichier.
const extension = MIME_TYPES[file.mimetype];
// Génération du nom de fichier final à l'aide du nom d'origine, de l'horodatage et de l'extension.
callback(null, name + '' + Date.now() + '.' + extension);
}
});

// Exportation de la configuration de Multer pour le téléchargement d'un seul fichier.
module.exports = multer({storage}).single('image');