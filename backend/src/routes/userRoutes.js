const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, optionalAuth } = require('../middleware/auth');

router.post('/sms/send', userController.sendSms);

router.post('/register', userController.register);

router.post('/login', userController.login);

router.post('/logout', auth, userController.logout);

router.get('/info', auth, userController.getUserInfo);

router.put('/update', auth, userController.updateUserInfo);

router.post('/resetPwd', userController.resetPassword);

router.get('/center', auth, userController.getUserCenter);

router.get('/cities', auth, userController.getUserCities);

router.post('/avatar', auth, userController.uploadAvatar);

router.put('/nickname', auth, userController.updateNickname);

router.put('/password', auth, userController.updatePassword);

module.exports = router;
