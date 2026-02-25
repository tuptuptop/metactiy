const pointsService = require('../services/pointsService');
const { AppError } = require('../middleware/errorHandler');

const pointsController = {
    async getBalance(req, res, next) {
        try {
            const balance = await pointsService.getBalance(req.user.userId);
            res.success({ balance });
        } catch (error) {
            next(error);
        }
    },
    
    async getRecords(req, res, next) {
        try {
            const { page = 1, pageSize = 20, type } = req.query;
            const result = await pointsService.getRecords(req.user.userId, {
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                type: type ? parseInt(type) : null
            });
            res.paginate(result.list, result.total, page, pageSize);
        } catch (error) {
            next(error);
        }
    },
    
    async earnPoints(req, res, next) {
        try {
            const { amount, source, description } = req.body;
            
            if (!amount || amount <= 0) {
                throw new AppError('Invalid amount', 400, 400);
            }
            
            const result = await pointsService.earnPoints(req.user.userId, amount, source, description);
            res.success(result, 'Points earned successfully');
        } catch (error) {
            next(error);
        }
    },
    
    async spendPoints(req, res, next) {
        try {
            const { amount, description } = req.body;
            
            if (!amount || amount <= 0) {
                throw new AppError('Invalid amount', 400, 400);
            }
            
            const result = await pointsService.spendPoints(req.user.userId, amount, description);
            res.success(result, 'Points spent successfully');
        } catch (error) {
            next(error);
        }
    }
};

module.exports = pointsController;
