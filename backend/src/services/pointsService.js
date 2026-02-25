const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { AppError } = require('../middleware/errorHandler');

const pointsService = {
    async getBalance(userId) {
        const user = await db.queryOne(
            'SELECT points FROM t_user WHERE user_id = ?',
            [userId]
        );
        
        return user ? user.points : 0;
    },
    
    async getRecords(userId, { page, pageSize, type }) {
        const offset = (page - 1) * pageSize;
        const conditions = ['user_id = ?'];
        const params = [userId];
        
        if (type) {
            conditions.push('type = ?');
            params.push(type);
        }
        
        const whereClause = conditions.join(' AND ');
        
        const list = await db.query(
            `SELECT record_id, type, amount, balance, source, description, created_at 
             FROM t_user_points 
             WHERE ${whereClause} 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [...params, pageSize, offset]
        );
        
        const countResult = await db.queryOne(
            `SELECT COUNT(*) as total FROM t_user_points WHERE ${whereClause}`,
            params
        );
        
        return {
            list,
            total: countResult.total
        };
    },
    
    async earnPoints(userId, amount, source, description) {
        return await db.transaction(async (connection) => {
            const [userResult] = await connection.execute(
                'SELECT points FROM t_user WHERE user_id = ? FOR UPDATE',
                [userId]
            );
            
            const currentBalance = userResult[0].points;
            const newBalance = currentBalance + amount;
            
            const recordId = 'P' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
            
            await connection.execute(
                `INSERT INTO t_user_points (record_id, user_id, type, amount, balance, source, description, created_at) 
                 VALUES (?, ?, 1, ?, ?, ?, ?, ?)`,
                [recordId, userId, amount, newBalance, source, description, new Date()]
            );
            
            await connection.execute(
                'UPDATE t_user SET points = ?, updated_at = ? WHERE user_id = ?',
                [newBalance, new Date(), userId]
            );
            
            return {
                recordId,
                amount,
                balance: newBalance
            };
        });
    },
    
    async spendPoints(userId, amount, description) {
        return await db.transaction(async (connection) => {
            const [userResult] = await connection.execute(
                'SELECT points FROM t_user WHERE user_id = ? FOR UPDATE',
                [userId]
            );
            
            const currentBalance = userResult[0].points;
            
            if (currentBalance < amount) {
                throw new AppError('Insufficient points balance', 400, 400);
            }
            
            const newBalance = currentBalance - amount;
            
            const recordId = 'P' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
            
            await connection.execute(
                `INSERT INTO t_user_points (record_id, user_id, type, amount, balance, source, description, created_at) 
                 VALUES (?, ?, 2, ?, ?, 'spend', ?, ?)`,
                [recordId, userId, amount, newBalance, description, new Date()]
            );
            
            await connection.execute(
                'UPDATE t_user SET points = ?, updated_at = ? WHERE user_id = ?',
                [newBalance, new Date(), userId]
            );
            
            return {
                recordId,
                amount,
                balance: newBalance
            };
        });
    },
    
    async addPointsRecord(userId, amount, source, description) {
        const currentBalance = await this.getBalance(userId);
        const newBalance = currentBalance + amount;
        
        const recordId = 'P' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
        
        await db.insert('t_user_points', {
            record_id: recordId,
            user_id: userId,
            type: 1,
            amount,
            balance: newBalance,
            source,
            description,
            created_at: new Date()
        });
        
        return {
            recordId,
            amount,
            balance: newBalance
        };
    }
};

module.exports = pointsService;
