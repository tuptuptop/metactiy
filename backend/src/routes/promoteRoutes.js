const express = require('express');
const router = express.Router();
const promoteController = require('../controllers/promoteController');
const { auth } = require('../middleware/auth');

router.get('/stats', auth, promoteController.getPromoteStats);

router.get('/invites', auth, promoteController.getInviteList);

router.get('/poster', auth, promoteController.generatePoster);

module.exports = router;
