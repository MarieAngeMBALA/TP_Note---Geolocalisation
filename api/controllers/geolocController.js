const axios = require('axios');
const Property = require('../../models/geolocModel');

exports.searchLocation = async (req, res) => {
  const { postalCode, dpe, ges } = req.query;

  try {
    // Utiliser l'API Nominatim pour obtenir les coordonnées géographiques
    const nominatimResponse = await axios.get(`https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&format=json&limit=1`);

    if (nominatimResponse.data && nominatimResponse.data.length > 0) {
      const { lat, lon } = nominatimResponse.data[0];

      /*// Enregistrez la propriété dans la base de données (facultatif)
      const property = new Property({ postalCode, dpe, ges, latitude: lat, longitude: lon });
      await property.save();*/

      res.json({ latitude: lat, longitude: lon });
    } else {
      throw new Error('Adresse non trouvée pour le code postal spécifié.');
    }
  } catch (error) {
    console.error('Erreur lors de la recherche de géolocalisation :', error.message);
    res.status(500).json({ error: 'Erreur lors de la recherche de géolocalisation' });
  }
};
