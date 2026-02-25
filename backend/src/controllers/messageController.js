const messageService = require('../services/messageService');
const { AppError } = require('../middleware/errorHandler');

const messageController = {
    async getMessageList(req, res, next) {
        try {
            const { page = 1, pageSize = 20, type } = req.query;
            const result = await messageService.getMessageList(req.user.userId, {
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                type: type ? parseInt(type) : null
            });
            res.paginate(result.list, result.total, page, pageSize);
        } catch (error) {
            next(error);
        }
    },
    
    async markAsRead(req, res, next) {
        try {
            const { msgIds } = req.body;
            
            if (!msgIds || !Array.isArray(msgIds)) {
                throw new AppError('Invalid message IDs', 400, 400);
            }
            
            await messageService.markAsRead(req.user.userId, msgIds);
            res.success(null, 'Messages marked as read');
        } catch (error) {
            next(error);
        }
    },
    
    async getUnreadCount(req, res, next) {
        try {
            const count = await messageService.getUnreadCount(req.user.userId);
            res.success({ count });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = messageController;
