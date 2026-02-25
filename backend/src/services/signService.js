const db = require('../config/database');
const config = require('../config');
const pointsService = require('./pointsService');
const { AppError } = require('../middleware/errorHandler');

const signService = {
    async doSign(userId) {
        const today = new Date().toISOString().split('T')[0];
        
        const existingSign = await db.queryOne(
            'SELECT * FROM t_user_sign WHERE user_id = ? AND sign_date = ?',
            [userId, today]
        );
        
        if (existingSign) {
            throw new AppError('Already signed in today', 400, 400);
        }
        
        const user = await db.queryOne(
            'SELECT continuous_sign_days, last_sign_date FROM t_user WHERE user_id = ?',
            [userId]
        );
        
        let continuousDays = 1;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (user.last_sign_date === yesterdayStr) {
            continuousDays = user.continuous_sign_days + 1;
        }
        
        if (continuousDays > 7) {
            continuousDays = 1;
        }
        
        let points = config.sign.basePoints;
        if (config.sign.continuousBonus[continuousDays]) {
            points += config.sign.continuousBonus[continuousDays];
        }
        
        await db.transaction(async (connection) => {
            await connection.execute(
                `INSERT INTO t_user_sign (user_id, sign_date, continuous_days, points_earned, created_at) 
                 VALUES (?, ?, ?, ?, ?)`,
                [userId, today, continuousDays, points, new Date()]
            );
            
            await connection.execute(
                `UPDATE t_user SET continuous_sign_days = ?, last_sign_date = ?, points = points + ?, updated_at = ? 
                 WHERE user_id = ?`,
                [continuousDays, today, points, new Date(), userId]
            );
        });
        
        await pointsService.addPointsRecord(userId, points, 'daily_sign', `Daily sign-in reward (Day ${continuousDays})`);
        
        return {
            signed: true,
            continuousDays,
            pointsEarned: points
        };
    },
    
    async getSignStatus(userId) {
        const today = new Date().toISOString().split('T')[0];
        
        const todaySign = await db.queryOne(
            'SELECT * FROM t_user_sign WHERE user_id = ? AND sign_date = ?',
            [userId, today]
        );
        
        const user = await db.queryOne(
            'SELECT continuous_sign_days, last_sign_date, points FROM t_user WHERE user_id = ?',
            [userId]
        );
        
        const totalDays = await db.queryOne(
            'SELECT COUNT(*) as count FROM t_user_sign WHERE user_id = ?',
            [userId]
        );
        
        const monthStart = new Date();
        monthStart.setDate(1);
        const monthStartStr = monthStart.toISOString().split('T')[0];
        
        const monthRecords = await db.query(
            `SELECT sign_date FROM t_user_sign 
             WHERE user_id = ? AND sign_date >= ? 
             ORDER BY sign_date`,
            [userId, monthStartStr]
        );
        
        return {
            todaySigned: !!todaySign,
            continuousDays: user.continuous_sign_days || 0,
            totalDays: totalDays.count || 0,
            todayPoints: todaySign ? todaySign.points_earned : 0,
            signCalendar: monthRecords.map(r => ({
                date: r.sign_date,
                signed: true
            }))
        };
    },
    
    async getSignRecords(userId, page, pageSize) {
        const offset = (page - 1) * pageSize;
        
        const list = await db.query(
            `SELECT sign_date, continuous_days, points_earned, created_at 
             FROM t_user_sign 
             WHERE user_id = ? 
             ORDER BY sign_date DESC 
             LIMIT ? OFFSET ?`,
            [userId, pageSize, offset]
        );
        
        const countResult = await db.queryOne(
            'SELECT COUNT(*) as total FROM t_user_sign WHERE user_id = ?',
            [userId]
        );
        
        return {
            list,
            total: countResult.total
        };
    }
};

module.exports = signService;
