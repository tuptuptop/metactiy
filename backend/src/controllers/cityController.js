const cityService = require('../services/cityService');
const { AppError } = require('../middleware/errorHandler');

const cityController = {
    async getCityList(req, res, next) {
        try {
            const { page = 1, pageSize = 20, categoryId, keyword, sortBy, sortOrder } = req.query;
            
            const result = await cityService.getCityList({
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                categoryId: categoryId ? parseInt(categoryId) : null,
                keyword,
                sortBy: sortBy || 'hot_level',
                sortOrder: sortOrder || 'DESC'
            });
            
            res.paginate(result.list, result.total, page, pageSize);
        } catch (error) {
            next(error);
        }
    },
    
    async getCityCategory(req, res, next) {
        try {
            const categories = await cityService.getCityCategories();
            res.success(categories);
        } catch (error) {
            next(error);
        }
    },
    
    async getHotCities(req, res, next) {
        try {
            const { limit = 10 } = req.query;
            const cities = await cityService.getHotCities(parseInt(limit));
            res.success(cities);
        } catch (error) {
            next(error);
        }
    },
    
    async searchCities(req, res, next) {
        try {
            const { keyword, page = 1, pageSize = 20 } = req.query;
            
            if (!keyword) {
                throw new AppError('Keyword is required', 400, 400);
            }
            
            const result = await cityService.searchCities(keyword, parseInt(page), parseInt(pageSize));
            res.paginate(result.list, result.total, page, pageSize);
        } catch (error) {
            next(error);
        }
    },
    
    async getCityDetail(req, res, next) {
        try {
            const { id } = req.params;
            
            const city = await cityService.getCityById(id);
            
            if (!city) {
                throw new AppError('City not found', 404, 404);
            }
            
            res.success(city);
        } catch (error) {
            next(error);
        }
    },
    
    async getCityAnnouncement(req, res, next) {
        try {
            const { id } = req.params;
            const { page = 1, pageSize = 10 } = req.query;
            
            const result = await cityService.getCityAnnouncements(id, parseInt(page), parseInt(pageSize));
            res.paginate(result.list, result.total, page, pageSize);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = cityController;
