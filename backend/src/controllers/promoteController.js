const promoteService = require('../services/promoteService');
const { AppError } = require('../middleware/errorHandler');

const promoteController = {
    async getPromoteStats(req, res, next) {
        try {
            const stats = await promoteService.getPromoteStats(req.user.userId);
            res.success(stats);
        } catch (error) {
            next(error);
        }
    },
    
    async getInviteList(req, res, next) {
        try {
            const { page = 1, pageSize = 20 } = req.query;
            const result = await promoteService.getInviteList(req.user.userId, parseInt(page), parseInt(pageSize));
            res.paginate(result.list, result.total, page, pageSize);
        } catch (error) {
            next(error);
        }
    },
    
    async generatePoster(req, res, next) {
        try {
            const posterUrl = await promoteService.generatePoster(req.user.userId);
            res.success({ posterUrl });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = promoteController;
