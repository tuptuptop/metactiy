const db = require('../config/database');

const messageService = {
    async getMessageList(userId, { page, pageSize, type }) {
        const offset = (page - 1) * pageSize;
        const conditions = ['user_id = ?'];
        const params = [userId];
        
        if (type) {
            conditions.push('type = ?');
            params.push(type);
        }
        
        const whereClause = conditions.join(' AND ');
        
        const list = await db.query(
            `SELECT msg_id, title, content, type, is_read, created_at 
             FROM t_message 
             WHERE ${whereClause} 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [...params, pageSize, offset]
        );
        
        const countResult = await db.queryOne(
            `SELECT COUNT(*) as total FROM t_message WHERE ${whereClause}`,
            params
        );
        
        return {
            list,
            total: countResult.total
        };
    },
    
    async markAsRead(userId, msgIds) {
        const placeholders = msgIds.map(() => '?').join(',');
        
        await db.query(
            `UPDATE t_message SET is_read = 1 WHERE user_id = ? AND msg_id IN (${placeholders})`,
            [userId, ...msgIds]
        );
    },
    
    async getUnreadCount(userId) {
        const result = await db.queryOne(
            'SELECT COUNT(*) as count FROM t_message WHERE user_id = ? AND is_read = 0',
            [userId]
        );
        
        return result.count;
    },
    
    async createMessage(userId, title, content, type) {
        const msgId = 'M' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
        
        await db.insert('t_message', {
            msg_id: msgId,
            user_id: userId,
            title,
            content,
            type,
            is_read: 0,
            created_at: new Date()
        });
        
        return msgId;
    }
};

module.exports = messageService;
