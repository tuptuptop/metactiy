const db = require('../config/database');

const feedbackService = {
    async createFeedback({ userId, type, content, contact, images }) {
        const feedbackId = 'F' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
        
        await db.insert('t_feedback', {
            feedback_id: feedbackId,
            user_id: userId,
            type,
            content,
            contact,
            images,
            status: 0,
            created_at: new Date(),
            updated_at: new Date()
        });
        
        return {
            feedbackId,
            success: true
        };
    },
    
    async getFeedbackList(userId, page, pageSize) {
        const offset = (page - 1) * pageSize;
        
        const list = await db.query(
            `SELECT feedback_id, type, content, status, reply, created_at 
             FROM t_feedback 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [userId, pageSize, offset]
        );
        
        const countResult = await db.queryOne(
            'SELECT COUNT(*) as total FROM t_feedback WHERE user_id = ?',
            [userId]
        );
        
        return {
            list,
            total: countResult.total
        };
    },
    
    async getFeedbackById(feedbackId, userId) {
        return await db.queryOne(
            'SELECT * FROM t_feedback WHERE feedback_id = ? AND user_id = ?',
            [feedbackId, userId]
        );
    },
    
    async updateFeedbackStatus(feedbackId, status, reply) {
        await db.update('t_feedback', 
            { status, reply, updated_at: new Date() },
            'feedback_id = ?',
            [feedbackId]
        );
    }
};

module.exports = feedbackService;
