const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { optionalAuth } = require('../middleware/auth');

router.get('/list', optionalAuth, noticeController.getNoticeList);

router.get('/detail/:id', noticeController.getNoticeDetail);

module.exports = router;
