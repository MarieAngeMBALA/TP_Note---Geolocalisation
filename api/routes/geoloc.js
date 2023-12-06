const express = require('express');
const router = express.Router();
const geolocController = require('../controllers/geolocController');
const authentification = require('../../middleware/usersMiddleware');

router.get('/geolocalisation', authentification, geolocController.searchLocation);
router.delete('/search/:searchId/result/:resultId',authentification, geolocController.deleteSearchResult);
module.exports = router;
