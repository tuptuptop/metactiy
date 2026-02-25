const db = require('../config/database');
const config = require('../config');

const promoteService = {
    async getPromoteStats(userId) {
        const user = await db.queryOne(
            'SELECT invite_code FROM t_user WHERE user_id = ?',
            [userId]
        );
        
        const inviteCount = await db.queryOne(
            `SELECT COUNT(*) as count FROM t_user 
             WHERE invited_by = ?`,
            [user.invite_code]
        );
        
        const validCount = await db.queryOne(
            `SELECT COUNT(*) as count FROM t_user u
             WHERE u.invited_by = ? AND u.status = 1`,
            [user.invite_code]
        );
        
        const todayEarnings = await db.queryOne(
            `SELECT COALESCE(SUM(amount), 0) as total 
             FROM t_user_points 
             WHERE user_id = ? AND source = 'invite_friend' 
             AND DATE(created_at) = CURDATE()`,
            [userId]
        );
        
        const totalEarnings = await db.queryOne(
            `SELECT COALESCE(SUM(amount), 0) as total 
             FROM t_user_points 
             WHERE user_id = ? AND source = 'invite_friend'`,
            [userId]
        );
        
        const inviteList = await db.query(
            `SELECT u.user_id, u.nickname, u.avatar, u.register_time, u.status 
             FROM t_user u
             WHERE u.invited_by = ? 
             ORDER BY u.register_time DESC 
             LIMIT 10`,
            [user.invite_code]
        );
        
        return {
            inviteCode: user.invite_code,
            inviteLink: `https://www.metacity.top/?invite=${user.invite_code}`,
            inviteCount: inviteCount.count || 0,
            validCount: validCount.count || 0,
            totalEarnings: totalEarnings.total || 0,
            todayEarnings: todayEarnings.total || 0,
            inviteList: inviteList.map(u => ({
                userId: u.user_id,
                nickname: u.nickname || 'New Resident',
                avatar: u.avatar,
                registerTime: u.register_time,
                status: u.status
            }))
        };
    },
    
    async getInviteList(userId, page, pageSize) {
        const user = await db.queryOne(
            'SELECT invite_code FROM t_user WHERE user_id = ?',
            [userId]
        );
        
        const offset = (page - 1) * pageSize;
        
        const list = await db.query(
            `SELECT u.user_id, u.nickname, u.avatar, u.register_time, u.status 
             FROM t_user u
             WHERE u.invited_by = ? 
             ORDER BY u.register_time DESC 
             LIMIT ? OFFSET ?`,
            [user.invite_code, pageSize, offset]
        );
        
        const countResult = await db.queryOne(
            `SELECT COUNT(*) as total FROM t_user WHERE invited_by = ?`,
            [user.invite_code]
        );
        
        return {
            list: list.map(u => ({
                userId: u.user_id,
                nickname: u.nickname || 'New Resident',
                avatar: u.avatar,
                registerTime: u.register_time,
                status: u.status
            })),
            total: countResult.total
        };
    },
    
    async generatePoster(userId) {
        const user = await db.queryOne(
            'SELECT invite_code, nickname FROM t_user WHERE user_id = ?',
            [userId]
        );
        
        const posterUrl = `https://www.metacity.top/poster/${user.invite_code}.png`;
        
        return posterUrl;
    }
};

module.exports = promoteService;
