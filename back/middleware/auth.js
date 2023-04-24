// Importation du module jsonwebtoken pour la gestion des tokens JWT.
const jwt = require('jsonwebtoken');

// Exportation d'une fonction middleware qui vérifie la validité d'un token JWT présent dans les en-têtes de la requête.
module.exports = (req, res, next) => {
try {
// On extrait le token de l'en-tête Authorization de la requête entrante.
const token = req.headers.authorization.split(' ')[1];
// On vérifie la validité du token à l'aide de la méthode verify de jsonwebtoken.
const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
// On extrait l'ID utilisateur du token vérifié.
const userId = decodedToken.userId;
// On compare l'ID utilisateur extrait de la requête avec celui du token.
if (req.body.userId && req.body.userId !== userId) {
// Si l'ID utilisateur de la requête est différent de celui du token, on lance une erreur.
throw 'User id non valable !';
} else {
// Si les IDs sont identiques, on passe au middleware suivant.
next();
}
} catch(error){
// Si une erreur est levée lors de la vérification du token, on retourne une réponse d'erreur 401 avec un message explicatif.
res.status(401).json({ error: new Error('Requête non authentifiée !')});
}
};