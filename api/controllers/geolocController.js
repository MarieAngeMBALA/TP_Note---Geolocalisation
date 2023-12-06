const axios = require('axios');
const datab = require('../../models/geolocModel');
const Search = require('../../models/searchesModel');
const User = require('../../models/usersModel');

exports.searchLocation = async (req, res) => {
  const { ges, dpe, code_postal, surface_min, surface_max } = req.query;
  console.log('Paramètres de Requête:', { ges, dpe, code_postal, surface_min, surface_max });

  try {
    const userId = req.user.id;

    let latitude, longitude;

    const query = {
      "Etiquette_GES": ges,
      "Etiquette_DPE": dpe,
      "Code_postal_(BAN)": code_postal,
    };

    if (surface_min && surface_max) {
      query['Surface_habitable_logement'] = { $gte: parseFloat(surface_min), $lte: parseFloat(surface_max) };
    } else if (surface_min) {
      query['Surface_habitable_logement'] = { $gte: parseFloat(surface_min) };
    } else if (surface_max) {
      query['Surface_habitable_logement'] = { $lte: parseFloat(surface_max) };
    }

    console.log('Requête à la base de données:', query);

    const donnees = await datab.findOne(query);

    if (!donnees) {
      console.error('Aucune donnée trouvée dans la base de données.');
      return res.status(404).json({ message: 'Aucune donnée trouvée dans la base de données.' });
    }

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?postalcode=${donnees['Code_postal_(BAN)']}&format=json`;
    const nominatimResponse = await axios.get(nominatimUrl);

    if (nominatimResponse.status === 200) {
      if (nominatimResponse.data.length === 0) {
        return res.status(404).json({ message: 'Aucune correspondance trouvée dans Nominatim.' });
      }

      latitude = nominatimResponse.data[0].lat;
      longitude = nominatimResponse.data[0].lon;

      console.log('UserID:', userId);
      const newSearch = new Search({
        user: userId,
        result: [
          {
            latitude: latitude,
            longitude: longitude,
          }
        ],
        title: `L'utilisateur a recherché : code postal = ${code_postal}, DPE = ${dpe}, GES = ${ges}`,
      });

      await newSearch.save();

      // Ajouter l'ID de la nouvelle recherche à la liste des recherches sauvegardées de l'utilisateur
      await User.findByIdAndUpdate(userId, { $push: { savedSearches: newSearch._id } }, { new: true });

     return res.json({ latitude, longitude });

    }

    return res.status(500).json({ message: 'Erreur serveur lors de l\'appel à Nominatim.' });

  } catch (error) {
    console.error('Erreur lors de la recherche dans la base de données :', error);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};


// Fonction pour supprimer une recherche spécifique
exports.deleteSearchResult = async (req, res) => {
  try {
    const { searchId, resultId } = req.params;

    // Vérifier si la recherche existe
    const search = await Search.findById(searchId);
    if (!search) {
      return res.status(404).json({ message: 'Recherche non trouvée.' });
    }

    // Vérifier si le résultat existe dans la recherche
    const resultIndex = search.result.findIndex(result => result._id.toString() === resultId);
    if (resultIndex === -1) {
      return res.status(404).json({ message: 'Résultat non trouvé dans la recherche.' });
    }

    // Supprimer le résultat de la recherche
    search.result.splice(resultIndex, 1);
    await search.save();

    // Mettre à jour l'utilisateur en retirant l'ID du résultat supprimé de la liste savedSearches
    await User.findByIdAndUpdate(search.user, { $pull: { savedSearches: searchId } });

    return res.json({ message: 'Résultat supprimé avec succès.' });

  } catch (error) {
    console.error('Erreur lors de la suppression du résultat de recherche :', error);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};


// Relancer une recherche 
exports.relancerRecherche = async (req, res) => {
  try {
    const { searchId } = req.params;

    // Récupérer les détails de la recherche existante en utilisant searchId
    const existingSearch = await Search.findById(searchId);

    if (!existingSearch) {
      return res.status(404).json({ message: 'Recherche non trouvée.' });
    }

    // Extraire les paramètres de la recherche existante
    const { ges, dpe, code_postal, /* autres paramètres */ } = existingSearch;

    // Appeler votre fonction de recherche avec les paramètres extraits
    const resultatNouvelleRecherche = await effectuerNouvelleRecherche({ ges, dpe, code_postal /*, autres paramètres */ });

    // Créer un nouveau document de recherche avec les résultats de la nouvelle recherche
    const nouvelleRecherche = new Search({
      user: existingSearch.user,  // Assurez-vous de conserver le même utilisateur
      ges,
      dpe,
      code_postal,
      // Ajoutez d'autres champs nécessaires ici
    });

    // Sauvegarder la nouvelle recherche dans la base de données
    await nouvelleRecherche.save();

    // Mettre à jour la référence dans le modèle utilisateur si nécessaire
    await User.findByIdAndUpdate(existingSearch.user, { $push: { savedSearches: nouvelleRecherche._id } }, { new: true });

    return res.json({ message: 'Recherche relancée avec succès.', nouvelleRecherche });

  } catch (error) {
    console.error('Erreur lors du relancement de la recherche :', error);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};