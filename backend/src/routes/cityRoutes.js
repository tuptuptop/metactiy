const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const { optionalAuth } = require('../middleware/auth');

router.get('/list', optionalAuth, cityController.getCityList);

router.get('/category', cityController.getCityCategory);

router.get('/hot', cityController.getHotCities);

router.get('/search', cityController.searchCities);

router.get('/detail/:id', optionalAuth, cityController.getCityDetail);

router.get('/announcement/:id', cityController.getCityAnnouncement);

module.exports = router;
