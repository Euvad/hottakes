// Importer les modules nécessaires
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Logique de l'enregistrement d'un utilisateur
exports.signup = (req, res, next) => {
// Hacher le mot de passe avant de l'enregistrer
bcrypt.hash(req.body.password, 10)
.then(hash => {
// Créer un nouvel utilisateur avec l'email et le mot de passe haché
const user = new User({
email: req.body.email,
password: hash
});
// Enregistrer l'utilisateur dans la base de données
user.save()
.then(() => res.status(201).json({ message: 'User created!' }))
.catch(error => res.status(400).json({ error }));
})
.catch(error => res.status(500).json({ error }));
};

// Logique de la connexion d'un utilisateur
exports.login = (req, res, next) => {
// Chercher l'utilisateur correspondant à l'email fourni
User.findOne({ email: req.body.email })
.then(user => {
if (user === null) {
// Si l'utilisateur n'est pas trouvé, renvoyer une erreur
res.status(401).json({ message: 'id/pass invalid.' });
} else {
// Comparer le mot de passe fourni avec le mot de passe haché dans la base de données
bcrypt.compare(req.body.password, user.password)
.then(valid => {
if (!valid) {
// Si les mots de passe ne correspondent pas, renvoyer une erreur
res.status(401).json({ message: 'id/pass invalid.' });
} else {
// Si les mots de passe correspondent, créer un token JWT et l'envoyer au client
res.status(201).json({
userId: user._id,
token: jwt.sign(
{ userId: user._id },
'RANDOM_TOKEN_SECRET',
{ expiresIn: '24h' }
)
});
}
})
.catch(error => {
// En cas d'erreur lors de la comparaison de mots de passe, renvoyer une erreur
res.status(500).json({ error });
})
}
})
.catch(error => {
// En cas d'erreur lors de la recherche de l'utilisateur, renvoyer une erreur
res.status(500).json({ error });
})
};