const express = require('express');
const router = express.Router();
const geolocController = require('../controllers/geolocController');

// recherche de géolocalisation
router.get('/search-location', geolocController.searchLocation);

module.exports = router;
