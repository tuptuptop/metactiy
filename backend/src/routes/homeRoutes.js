const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const { optionalAuth } = require('../middleware/auth');

router.get('/index', optionalAuth, homeController.getHomeData);

router.get('/banner', homeController.getBanners);

router.get('/news', homeController.getNews);

module.exports = router;
