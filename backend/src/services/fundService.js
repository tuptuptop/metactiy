const db = require('../config/database');

const fundService = {
    async getFundList({ page, pageSize, fundType }) {
        const offset = (page - 1) * pageSize;
        const conditions = ['status = 1'];
        const params = [];
        
        if (fundType) {
            conditions.push('fund_type = ?');
            params.push(fundType);
        }
        
        const whereClause = conditions.join(' AND ');
        
        const list = await db.query(
            `SELECT fund_id, fund_name, fund_type, description, 
                    target_amount, current_amount, donor_count, status 
             FROM t_fund 
             WHERE ${whereClause} 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [...params, pageSize, offset]
        );
        
        const countResult = await db.queryOne(
            `SELECT COUNT(*) as total FROM t_fund WHERE ${whereClause}`,
            params
        );
        
        return {
            list,
            total: countResult.total
        };
    },
    
    async getFundById(fundId) {
        return await db.queryOne(
            `SELECT * FROM t_fund WHERE fund_id = ? AND status = 1`,
            [fundId]
        );
    },
    
    async getDonations(fundId, page, pageSize) {
        const offset = (page - 1) * pageSize;
        const conditions = ['status = 1'];
        const params = [];
        
        if (fundId) {
            conditions.push('fund_id = ?');
            params.push(fundId);
        }
        
        const whereClause = conditions.join(' AND ');
        
        const list = await db.query(
            `SELECT d.*, u.nickname, u.avatar 
             FROM t_fund_donation d
             LEFT JOIN t_user u ON d.user_id = u.user_id
             WHERE ${whereClause} 
             ORDER BY d.created_at DESC 
             LIMIT ? OFFSET ?`,
            [...params, pageSize, offset]
        );
        
        const countResult = await db.queryOne(
            `SELECT COUNT(*) as total FROM t_fund_donation WHERE ${whereClause}`,
            params
        );
        
        return {
            list: list.map(d => ({
                donationId: d.donation_id,
                fundId: d.fund_id,
                userId: d.user_id,
                nickname: d.nickname || 'Anonymous',
                avatar: d.avatar,
                amount: d.amount,
                message: d.message,
                createdAt: d.created_at
            })),
            total: countResult.total
        };
    }
};

module.exports = fundService;
