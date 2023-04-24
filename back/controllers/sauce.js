const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const oldFilename = sauce.imageUrl.split("/images/")[1];
      const sauceObject = req.file ?
        {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => {
          if (req.file) {
            // If a new file is uploaded, delete the old file
            fs.unlink(`images/${oldFilename}`, (error) => {
              if (error) {
                console.log(error);
              }
            });
          }
          res.status(200).json({ message: 'Sauce modifiée' });
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Cette fonction permet de gérer les likes et les dislikes d'une sauce.

exports.likeOrDislike = async (req, res, next) => {
  try {
    // On recherche la sauce dans la base de données à partir de son id.
    const sauce = await Sauce.findById(req.params.id);
    // Si la sauce n'existe pas, on renvoie un message d'erreur.
    if (!sauce) {
      return res.status(404).json({ error: "Sauce non trouvée" });
    }

    // On récupère l'id de l'utilisateur qui a voté et la valeur du vote (like, dislike ou annulation).
    const userId = req.body.userId;
    const like = req.body.like;

    // On vérifie si l'utilisateur a déjà liké ou disliké la sauce.
    const indexLiked = sauce.usersLiked.indexOf(userId);
    const indexDisliked = sauce.usersDisliked.indexOf(userId);

    // Si l'utilisateur annule son vote.
    if (like === 0) {
      // Si l'utilisateur avait déjà liké la sauce, on supprime son like et on décrémente le nombre de likes.
      if (indexLiked !== -1) {
        sauce.usersLiked.splice(indexLiked, 1);
        sauce.likes--;
        await sauce.save();
        return res.status(200).json({ message: "Like supprimé !" });
      }
      // Si l'utilisateur avait déjà disliké la sauce, on supprime son dislike et on décrémente le nombre de dislikes.
      if (indexDisliked !== -1) {
        sauce.usersDisliked.splice(indexDisliked, 1);
        sauce.dislikes--;
        await sauce.save();
        return res.status(200).json({ message: "Dislike supprimé !" });
      }
      // Si l'utilisateur n'avait pas encore voté, on renvoie un message pour indiquer que le vote est annulé.
      return res.status(200).json({ message: "Vote annulé !" });
    }

    // Si l'utilisateur vote "like".
    if (like === 1) {
      // Si l'utilisateur n'avait pas encore liké la sauce, on ajoute son like et on incrémente le nombre de likes.
      if (indexLiked === -1) {
        sauce.usersLiked.push(userId);
        sauce.likes++;
        // Si l'utilisateur avait déjà disliké la sauce, on supprime son dislike et on décrémente le nombre de dislikes.
        if (indexDisliked !== -1) {
          sauce.usersDisliked.splice(indexDisliked, 1);
          sauce.dislikes--;
        }
        await sauce.save();
        return res.status(200).json({ message: "Like ajouté !" });
      }
      // Si l'utilisateur avait déjà liké la sauce, on renvoie un message pour indiquer que le like est déjà existant.
      return res.status(200).json({ message: "Like existant !" });
    }

    // Si l'utilisateur vote "dislike".
    if (like === -1) {
      // Si l'utilisateur n'avait pas encore disliké la sauce, on ajoute son dislike et on incrémente le nombre de dislikes.
      if (indexDisliked === -1) {
        sauce.usersDisliked.push(userId);
        sauce.dislikes++;
        // Si l'utilisateur avait déjà liké la sauce, on supprime son like et on décrémente le nombre de likes.
        if (indexLiked !== -1) {
          sauce.usersLiked.splice(indexLiked, 1);
          sauce.likes--;
        }
        await sauce.save();
        return res.status(200).json({ message: "Dislike ajouté !" });
      }
      return res.status(200).json({ message: "Dislike existant !" });
    }

    return res.status(400).json({ error: "Requête invalide !" });

  } catch (error) {
    return res.status(400).json({ error });
  }
};