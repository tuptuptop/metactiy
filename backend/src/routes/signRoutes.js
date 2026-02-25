const express = require('express');
const router = express.Router();
const signController = require('../controllers/signController');
const { auth } = require('../middleware/auth');

router.post('/do', auth, signController.doSign);

router.get('/status', auth, signController.getSignStatus);

router.get('/records', auth, signController.getSignRecords);

module.exports = router;
