const db = require('../config/database');
const redisClient = require('../config/redis');

const homeService = {
    async getHomeData(userId) {
        const cacheKey = 'home:data';
        const cached = await redisClient.get(cacheKey);
        
        if (cached) {
            return cached;
        }
        
        const banners = await this.getBanners('home');
        
        const hotCities = await db.query(
            `SELECT city_id, city_name, cover_image, sold_count, min_price, hot_level
             FROM t_city 
             WHERE status = 1 AND hot_level >= 4 
             ORDER BY hot_level DESC, sold_count DESC 
             LIMIT 8`
        );
        
        const news = await db.query(
            `SELECT id, title, content, type, created_at 
             FROM t_news 
             WHERE status = 1 
             ORDER BY created_at DESC 
             LIMIT 5`
        );
        
        const notice = await db.queryOne(
            `SELECT notice_id, title, content 
             FROM t_notice 
             WHERE status = 1 AND is_top = 1 
             ORDER BY created_at DESC 
             LIMIT 1`
        );
        
        const data = {
            banners,
            hotCities,
            news,
            notice
        };
        
        await redisClient.set(cacheKey, data, 60);
        
        return data;
    },
    
    async getBanners(position) {
        const cacheKey = `banners:${position}`;
        const cached = await redisClient.get(cacheKey);
        
        if (cached) {
            return cached;
        }
        
        const banners = await db.query(
            `SELECT id, title, image_url, link_url, sort_order 
             FROM t_banner 
             WHERE position = ? AND status = 1 
             ORDER BY sort_order ASC`,
            [position]
        );
        
        await redisClient.set(cacheKey, banners, 300);
        
        return banners;
    },
    
    async getNews(page, pageSize) {
        const offset = (page - 1) * pageSize;
        
        const list = await db.query(
            `SELECT id, title, content, type, created_at 
             FROM t_news 
             WHERE status = 1 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [pageSize, offset]
        );
        
        const countResult = await db.queryOne(
            'SELECT COUNT(*) as total FROM t_news WHERE status = 1'
        );
        
        return {
            list,
            total: countResult.total
        };
    }
};

module.exports = homeService;
