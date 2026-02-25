const express = require('express');
const router = express.Router();
const pointsController = require('../controllers/pointsController');
const { auth } = require('../middleware/auth');

router.get('/balance', auth, pointsController.getBalance);

router.get('/records', auth, pointsController.getRecords);

router.post('/earn', auth, pointsController.earnPoints);

router.post('/spend', auth, pointsController.spendPoints);

module.exports = router;
