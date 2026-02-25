const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const userService = require('../services/userService');
const { generateToken } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

const userController = {
    async sendSms(req, res, next) {
        try {
            const { phone } = req.body;
            
            if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
                throw new AppError('Invalid phone number', 400, 400);
            }
            
            const result = await userService.sendSmsCode(phone);
            
            res.success(result, 'SMS sent successfully');
        } catch (error) {
            next(error);
        }
    },
    
    async register(req, res, next) {
        try {
            const { phone, password, code, inviteCode } = req.body;
            
            if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
                throw new AppError('Invalid phone number', 400, 400);
            }
            
            if (!code || !/^\d{6}$/.test(code)) {
                throw new AppError('Invalid verification code', 400, 400);
            }
            
            if (!password || password.length < 6) {
                throw new AppError('Password must be at least 6 characters', 400, 400);
            }
            
            const isValidCode = await userService.verifySmsCode(phone, code);
            if (!isValidCode) {
                throw new AppError('Invalid or expired verification code', 400, 400);
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const userId = 'U' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
            const userInviteCode = Math.random().toString(36).substr(2, 6).toUpperCase();
            
            const user = await userService.createUser({
                userId,
                phone,
                password: hashedPassword,
                inviteCode: userInviteCode,
                invitedBy: inviteCode || null
            });
            
            const token = generateToken({ userId: user.userId, phone: user.phone });
            
            res.success({
                token,
                user: {
                    userId: user.userId,
                    phone: user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
                    nickname: user.nickname,
                    avatar: user.avatar,
                    inviteCode: user.inviteCode
                }
            }, 'Registration successful');
        } catch (error) {
            next(error);
        }
    },
    
    async login(req, res, next) {
        try {
            const { phone, password, code, loginType } = req.body;
            
            if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
                throw new AppError('Invalid phone number', 400, 400);
            }
            
            let user;
            
            if (loginType === 'password') {
                if (!password) {
                    throw new AppError('Password is required', 400, 400);
                }
                
                user = await userService.getUserByPhone(phone);
                if (!user) {
                    throw new AppError('User not found', 404, 404);
                }
                
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    throw new AppError('Invalid password', 401, 401);
                }
            } else if (loginType === 'code') {
                if (!code || !/^\d{6}$/.test(code)) {
                    throw new AppError('Invalid verification code', 400, 400);
                }
                
                const isValidCode = await userService.verifySmsCode(phone, code);
                if (!isValidCode) {
                    throw new AppError('Invalid or expired verification code', 400, 400);
                }
                
                user = await userService.getUserByPhone(phone);
                if (!user) {
                    throw new AppError('User not found', 404, 404);
                }
            } else {
                throw new AppError('Invalid login type', 400, 400);
            }
            
            if (user.status !== 1) {
                throw new AppError('Account is disabled', 403, 403);
            }
            
            await userService.updateLoginTime(user.userId);
            
            const token = generateToken({ userId: user.userId, phone: user.phone });
            
            res.success({
                token,
                user: {
                    userId: user.userId,
                    phone: user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
                    nickname: user.nickname,
                    avatar: user.avatar,
                    inviteCode: user.inviteCode
                }
            }, 'Login successful');
        } catch (error) {
            next(error);
        }
    },
    
    async logout(req, res, next) {
        try {
            res.success(null, 'Logout successful');
        } catch (error) {
            next(error);
        }
    },
    
    async getUserInfo(req, res, next) {
        try {
            const user = await userService.getUserById(req.user.userId);
            
            if (!user) {
                throw new AppError('User not found', 404, 404);
            }
            
            res.success({
                userId: user.userId,
                phone: user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
                nickname: user.nickname,
                avatar: user.avatar,
                registerTime: user.register_time,
                inviteCode: user.inviteCode
            });
        } catch (error) {
            next(error);
        }
    },
    
    async updateUserInfo(req, res, next) {
        try {
            const { nickname, avatar } = req.body;
            
            const updateData = {};
            if (nickname) updateData.nickname = nickname;
            if (avatar) updateData.avatar = avatar;
            
            await userService.updateUser(req.user.userId, updateData);
            
            res.success(null, 'Update successful');
        } catch (error) {
            next(error);
        }
    },
    
    async resetPassword(req, res, next) {
        try {
            const { phone, code, newPassword } = req.body;
            
            if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
                throw new AppError('Invalid phone number', 400, 400);
            }
            
            if (!code || !/^\d{6}$/.test(code)) {
                throw new AppError('Invalid verification code', 400, 400);
            }
            
            if (!newPassword || newPassword.length < 6) {
                throw new AppError('Password must be at least 6 characters', 400, 400);
            }
            
            const isValidCode = await userService.verifySmsCode(phone, code);
            if (!isValidCode) {
                throw new AppError('Invalid or expired verification code', 400, 400);
            }
            
            const user = await userService.getUserByPhone(phone);
            if (!user) {
                throw new AppError('User not found', 404, 404);
            }
            
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await userService.updateUser(user.userId, { password: hashedPassword });
            
            res.success(null, 'Password reset successful');
        } catch (error) {
            next(error);
        }
    },
    
    async getUserCenter(req, res, next) {
        try {
            const centerData = await userService.getUserCenterData(req.user.userId);
            res.success(centerData);
        } catch (error) {
            next(error);
        }
    },
    
    async getUserCities(req, res, next) {
        try {
            const { page = 1, pageSize = 20 } = req.query;
            const result = await userService.getUserCities(req.user.userId, page, pageSize);
            res.paginate(result.list, result.total, page, pageSize);
        } catch (error) {
            next(error);
        }
    },
    
    async uploadAvatar(req, res, next) {
        try {
            if (!req.file) {
                throw new AppError('No file uploaded', 400, 400);
            }
            
            const avatarUrl = `/uploads/${req.file.filename}`;
            await userService.updateUser(req.user.userId, { avatar: avatarUrl });
            
            res.success({ avatar: avatarUrl }, 'Avatar uploaded successfully');
        } catch (error) {
            next(error);
        }
    },
    
    async updateNickname(req, res, next) {
        try {
            const { nickname } = req.body;
            
            if (!nickname || nickname.length > 20) {
                throw new AppError('Nickname must be 1-20 characters', 400, 400);
            }
            
            await userService.updateUser(req.user.userId, { nickname });
            
            res.success(null, 'Nickname updated successfully');
        } catch (error) {
            next(error);
        }
    },
    
    async updatePassword(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body;
            
            if (!oldPassword || !newPassword || newPassword.length < 6) {
                throw new AppError('Invalid password', 400, 400);
            }
            
            const user = await userService.getUserById(req.user.userId);
            
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                throw new AppError('Old password is incorrect', 401, 401);
            }
            
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await userService.updateUser(req.user.userId, { password: hashedPassword });
            
            res.success(null, 'Password updated successfully');
        } catch (error) {
            next(error);
        }
    }
};

module.exports = userController;
