
const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MAM_users',
  },
  result: [{
    latitude: String,
    longitude: String,
  }],
  title: String,
});

const mam_searches = mongoose.model('mam_searches', searchSchema);

module.exports = mam_searches;





/*const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  ges: String,
  dpe: String,
  code_postal: String,
  latitude: String,
  longitude: String,
  date: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'mam_users',
  },
  // Ajoutez les éléments spécifiques utilisés pour la recherche
  elements_de_recherche: {
    type: {
      type: String,
    },
    value: String,   // La valeur de l'élément utilisée pour la recherche
  },
});

const mam_searches = mongoose.model('mam_searches', searchSchema);

module.exports = mam_searches;*/
