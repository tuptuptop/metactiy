const express = require('express');
const router = express.Router();
const fundController = require('../controllers/fundController');
const { optionalAuth } = require('../middleware/auth');

router.get('/list', optionalAuth, fundController.getFundList);

router.get('/detail/:id', optionalAuth, fundController.getFundDetail);

router.get('/donations', fundController.getDonations);

module.exports = router;
