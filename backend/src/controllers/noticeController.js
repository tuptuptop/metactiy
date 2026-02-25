const noticeService = require('../services/noticeService');
const { AppError } = require('../middleware/errorHandler');

const noticeController = {
    async getNoticeList(req, res, next) {
        try {
            const { page = 1, pageSize = 20, type } = req.query;
            const result = await noticeService.getNoticeList({
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                type: type ? parseInt(type) : null
            });
            res.paginate(result.list, result.total, page, pageSize);
        } catch (error) {
            next(error);
        }
    },
    
    async getNoticeDetail(req, res, next) {
        try {
            const { id } = req.params;
            const notice = await noticeService.getNoticeById(id);
            
            if (!notice) {
                throw new AppError('Notice not found', 404, 404);
            }
            
            await noticeService.incrementReadCount(id);
            
            res.success(notice);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = noticeController;
