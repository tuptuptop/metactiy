const homeService = require('../services/homeService');
const { AppError } = require('../middleware/errorHandler');

const homeController = {
    async getHomeData(req, res, next) {
        try {
            const userId = req.user ? req.user.userId : null;
            const data = await homeService.getHomeData(userId);
            res.success(data);
        } catch (error) {
            next(error);
        }
    },
    
    async getBanners(req, res, next) {
        try {
            const { position = 'home' } = req.query;
            const banners = await homeService.getBanners(position);
            res.success(banners);
        } catch (error) {
            next(error);
        }
    },
    
    async getNews(req, res, next) {
        try {
            const { page = 1, pageSize = 10 } = req.query;
            const result = await homeService.getNews(parseInt(page), parseInt(pageSize));
            res.paginate(result.list, result.total, page, pageSize);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = homeController;
