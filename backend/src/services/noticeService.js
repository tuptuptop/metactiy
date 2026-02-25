const db = require('../config/database');

const noticeService = {
    async getNoticeList({ page, pageSize, type }) {
        const offset = (page - 1) * pageSize;
        const conditions = ['status = 1'];
        const params = [];
        
        if (type) {
            conditions.push('type = ?');
            params.push(type);
        }
        
        const whereClause = conditions.join(' AND ');
        
        const list = await db.query(
            `SELECT notice_id, title, content, type, is_top, read_count, created_at 
             FROM t_notice 
             WHERE ${whereClause} 
             ORDER BY is_top DESC, created_at DESC 
             LIMIT ? OFFSET ?`,
            [...params, pageSize, offset]
        );
        
        const countResult = await db.queryOne(
            `SELECT COUNT(*) as total FROM t_notice WHERE ${whereClause}`,
            params
        );
        
        return {
            list,
            total: countResult.total
        };
    },
    
    async getNoticeById(noticeId) {
        return await db.queryOne(
            `SELECT * FROM t_notice WHERE notice_id = ? AND status = 1`,
            [noticeId]
        );
    },
    
    async incrementReadCount(noticeId) {
        await db.query(
            'UPDATE t_notice SET read_count = read_count + 1 WHERE notice_id = ?',
            [noticeId]
        );
    }
};

module.exports = noticeService;
