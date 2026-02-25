const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { auth } = require('../middleware/auth');

router.post('/submit', auth, feedbackController.submitFeedback);

router.get('/list', auth, feedbackController.getFeedbackList);

router.get('/detail/:id', auth, feedbackController.getFeedbackDetail);

module.exports = router;
