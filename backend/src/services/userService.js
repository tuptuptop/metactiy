const db = require('../config/database');
const redisClient = require('../config/redis');
const { AppError } = require('../middleware/errorHandler');

const userService = {
    async sendSmsCode(phone) {
        const code = Math.random().toString().slice(-6);
        
        await redisClient.set(`sms:${phone}`, code, 300);
        
        console.log(`[SMS] Phone: ${phone}, Code: ${code}`);
        
        return { success: true };
    },
    
    async verifySmsCode(phone, code) {
        const storedCode = await redisClient.get(`sms:${phone}`);
        
        if (!storedCode || storedCode !== code) {
            return false;
        }
        
        await redisClient.del(`sms:${phone}`);
        
        return true;
    },
    
    async createUser(userData) {
        const { userId, phone, password, inviteCode, invitedBy } = userData;
        
        const existingUser = await this.getUserByPhone(phone);
        if (existingUser) {
            throw new AppError('Phone number already registered', 409, 409);
        }
        
        await db.insert('t_user', {
            user_id: userId,
            phone,
            password,
            invite_code: inviteCode,
            invited_by: invitedBy,
            status: 1,
            points: 0,
            continuous_sign_days: 0,
            register_time: new Date(),
            created_at: new Date(),
            updated_at: new Date()
        });
        
        return { userId, phone, inviteCode };
    },
    
    async getUserByPhone(phone) {
        return await db.queryOne(
            'SELECT * FROM t_user WHERE phone = ?',
            [phone]
        );
    },
    
    async getUserById(userId) {
        return await db.queryOne(
            'SELECT * FROM t_user WHERE user_id = ?',
            [userId]
        );
    },
    
    async updateUser(userId, updateData) {
        const fields = [];
        const values = [];
        
        for (const [key, value] of Object.entries(updateData)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        
        fields.push('updated_at = ?');
        values.push(new Date());
        
        values.push(userId);
        
        await db.query(
            `UPDATE t_user SET ${fields.join(', ')} WHERE user_id = ?`,
            values
        );
    },
    
    async updateLoginTime(userId) {
        await db.update('t_user', 
            { last_login_time: new Date() },
            'user_id = ?',
            [userId]
        );
    },
    
    async getUserCenterData(userId) {
        const user = await this.getUserById(userId);
        
        if (!user) {
            throw new AppError('User not found', 404, 404);
        }
        
        const cityCount = await db.queryOne(
            'SELECT COUNT(*) as count FROM t_user_city WHERE user_id = ?',
            [userId]
        );
        
        const blockCount = await db.queryOne(
            'SELECT COUNT(*) as count FROM t_user_block WHERE user_id = ?',
            [userId]
        );
        
        const inviteCount = await db.queryOne(
            'SELECT COUNT(*) as count FROM t_user WHERE invited_by = (SELECT invite_code FROM t_user WHERE user_id = ?)',
            [userId]
        );
        
        return {
            userInfo: {
                userId: user.user_id,
                nickname: user.nickname,
                avatar: user.avatar,
                phone: user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
                registerTime: user.register_time
            },
            assets: {
                totalCities: cityCount.count || 0,
                totalBlocks: blockCount.count || 0,
                totalPoints: user.points || 0,
                totalEarnings: 0
            },
            inviteInfo: {
                inviteCode: user.invite_code,
                inviteCount: inviteCount.count || 0,
                inviteEarnings: 0
            }
        };
    },
    
    async getUserCities(userId, page, pageSize) {
        const offset = (page - 1) * pageSize;
        
        const list = await db.query(
            `SELECT uc.*, c.city_name, c.cover_image 
             FROM t_user_city uc 
             LEFT JOIN t_city c ON uc.city_id = c.city_id 
             WHERE uc.user_id = ? 
             ORDER BY uc.created_at DESC 
             LIMIT ? OFFSET ?`,
            [userId, pageSize, offset]
        );
        
        const countResult = await db.queryOne(
            'SELECT COUNT(*) as total FROM t_user_city WHERE user_id = ?',
            [userId]
        );
        
        return {
            list,
            total: countResult.total
        };
    },
    
    async getUserByInviteCode(inviteCode) {
        return await db.queryOne(
            'SELECT * FROM t_user WHERE invite_code = ?',
            [inviteCode]
        );
    }
};

module.exports = userService;
