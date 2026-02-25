const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const cityRoutes = require('./cityRoutes');
const homeRoutes = require('./homeRoutes');
const signRoutes = require('./signRoutes');
const pointsRoutes = require('./pointsRoutes');
const promoteRoutes = require('./promoteRoutes');
const fundRoutes = require('./fundRoutes');
const noticeRoutes = require('./noticeRoutes');
const messageRoutes = require('./messageRoutes');
const feedbackRoutes = require('./feedbackRoutes');

router.use('/user', userRoutes);
router.use('/city', cityRoutes);
router.use('/home', homeRoutes);
router.use('/sign', signRoutes);
router.use('/points', pointsRoutes);
router.use('/promote', promoteRoutes);
router.use('/fund', fundRoutes);
router.use('/notice', noticeRoutes);
router.use('/message', messageRoutes);
router.use('/feedback', feedbackRoutes);

router.get('/health', (req, res) => {
    res.success({ status: 'ok', service: 'metacity-api' });
});

module.exports = router;
