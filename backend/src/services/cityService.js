const db = require('../config/database');
const redisClient = require('../config/redis');

const cityService = {
    async getCityList({ page, pageSize, categoryId, keyword, sortBy, sortOrder }) {
        const offset = (page - 1) * pageSize;
        const conditions = ['status = 1'];
        const params = [];
        
        if (categoryId) {
            conditions.push('category_id = ?');
            params.push(categoryId);
        }
        
        if (keyword) {
            conditions.push('(city_name LIKE ? OR province LIKE ?)');
            params.push(`%${keyword}%`, `%${keyword}%`);
        }
        
        const whereClause = conditions.join(' AND ');
        const orderClause = `${sortBy} ${sortOrder}`;
        
        const list = await db.query(
            `SELECT city_id, city_name, city_code, province, category_id, 
                    cover_image, sold_count, total_count, min_price, hot_level, status
             FROM t_city 
             WHERE ${whereClause} 
             ORDER BY ${orderClause} 
             LIMIT ? OFFSET ?`,
            [...params, pageSize, offset]
        );
        
        const countResult = await db.queryOne(
            `SELECT COUNT(*) as total FROM t_city WHERE ${whereClause}`,
            params
        );
        
        return {
            list,
            total: countResult.total
        };
    },
    
    async getCityCategories() {
        return await db.query(
            'SELECT * FROM t_city_category WHERE status = 1 ORDER BY sort_order'
        );
    },
    
    async getHotCities(limit) {
        const cacheKey = `hot_cities:${limit}`;
        const cached = await redisClient.get(cacheKey);
        
        if (cached) {
            return cached;
        }
        
        const cities = await db.query(
            `SELECT city_id, city_name, city_code, province, cover_image, 
                    sold_count, total_count, min_price, hot_level
             FROM t_city 
             WHERE status = 1 AND hot_level >= 4 
             ORDER BY hot_level DESC, sold_count DESC 
             LIMIT ?`,
            [limit]
        );
        
        await redisClient.set(cacheKey, cities, 300);
        
        return cities;
    },
    
    async searchCities(keyword, page, pageSize) {
        const offset = (page - 1) * pageSize;
        
        const list = await db.query(
            `SELECT city_id, city_name, city_code, province, category_id, 
                    cover_image, sold_count, total_count, min_price, hot_level
             FROM t_city 
             WHERE status = 1 AND (city_name LIKE ? OR province LIKE ?)
             ORDER BY hot_level DESC
             LIMIT ? OFFSET ?`,
            [`%${keyword}%`, `%${keyword}%`, pageSize, offset]
        );
        
        const countResult = await db.queryOne(
            `SELECT COUNT(*) as total FROM t_city 
             WHERE status = 1 AND (city_name LIKE ? OR province LIKE ?)`,
            [`%${keyword}%`, `%${keyword}%`]
        );
        
        return {
            list,
            total: countResult.total
        };
    },
    
    async getCityById(cityId) {
        const cacheKey = `city:${cityId}`;
        const cached = await redisClient.get(cacheKey);
        
        if (cached) {
            return cached;
        }
        
        const city = await db.queryOne(
            `SELECT * FROM t_city WHERE city_id = ? AND status = 1`,
            [cityId]
        );
        
        if (city) {
            await redisClient.set(cacheKey, city, 60);
        }
        
        return city;
    },
    
    async getCityAnnouncements(cityId, page, pageSize) {
        const offset = (page - 1) * pageSize;
        
        const list = await db.query(
            `SELECT * FROM t_city_announcement 
             WHERE city_id = ? AND status = 1 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [cityId, pageSize, offset]
        );
        
        const countResult = await db.queryOne(
            `SELECT COUNT(*) as total FROM t_city_announcement 
             WHERE city_id = ? AND status = 1`,
            [cityId]
        );
        
        return {
            list,
            total: countResult.total
        };
    }
};

module.exports = cityService;
