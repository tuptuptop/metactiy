const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

router.get('/list', auth, messageController.getMessageList);

router.put('/read', auth, messageController.markAsRead);

router.get('/unread', auth, messageController.getUnreadCount);

module.exports = router;
