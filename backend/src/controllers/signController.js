const signService = require('../services/signService');
const { AppError } = require('../middleware/errorHandler');

const signController = {
    async doSign(req, res, next) {
        try {
            const result = await signService.doSign(req.user.userId);
            res.success(result, 'Sign in successful');
        } catch (error) {
            next(error);
        }
    },
    
    async getSignStatus(req, res, next) {
        try {
            const status = await signService.getSignStatus(req.user.userId);
            res.success(status);
        } catch (error) {
            next(error);
        }
    },
    
    async getSignRecords(req, res, next) {
        try {
            const { page = 1, pageSize = 30 } = req.query;
            const result = await signService.getSignRecords(req.user.userId, parseInt(page), parseInt(pageSize));
            res.paginate(result.list, result.total, page, pageSize);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = signController;
