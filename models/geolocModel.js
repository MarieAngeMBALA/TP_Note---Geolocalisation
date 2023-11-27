const mongoose = require('mongoose');

const geolocSchema = new mongoose.Schema({
    N_departement_BAN: { type: Number, required: true },
    Date_reception_DPE: { type: Date, required: true },
    Date_etablissement_DPE: { type: Date, required: true },
    Date_visite_diagnostiqueur: { type: Date, required: true },
    Etiquette_GES: { type: String, required: true },
    Etiquette_DPE: { type: String, required: true },
    Annee_construction: { type: Number, required: true },
    Surface_habitable_logement: { type: Number, required: true },
    Adresse_BAN: { type: String, required: true },
    Code_postal_BAN: { type: Number, required: true },
});

const geolocalisation = mongoose.model('depmini72', geolocSchema);

module.exports = geolocalisation;
