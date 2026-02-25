const fundService = require('../services/fundService');
const { AppError } = require('../middleware/errorHandler');

const fundController = {
    async getFundList(req, res, next) {
        try {
            const { page = 1, pageSize = 20, fundType } = req.query;
            const result = await fundService.getFundList({
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                fundType
            });
            res.paginate(result.list, result.total, page, pageSize);
        } catch (error) {
            next(error);
        }
    },
    
    async getFundDetail(req, res, next) {
        try {
            const { id } = req.params;
            const fund = await fundService.getFundById(id);
            
            if (!fund) {
                throw new AppError('Fund not found', 404, 404);
            }
            
            res.success(fund);
        } catch (error) {
            next(error);
        }
    },
    
    async getDonations(req, res, next) {
        try {
            const { fundId, page = 1, pageSize = 20 } = req.query;
            const result = await fundService.getDonations(fundId, parseInt(page), parseInt(pageSize));
            res.paginate(result.list, result.total, page, pageSize);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = fundController;
