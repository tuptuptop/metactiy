const feedbackService = require('../services/feedbackService');
const { AppError } = require('../middleware/errorHandler');

const feedbackController = {
    async submitFeedback(req, res, next) {
        try {
            const { type, content, contact, images } = req.body;
            
            if (!content || content.trim().length === 0) {
                throw new AppError('Feedback content is required', 400, 400);
            }
            
            const result = await feedbackService.createFeedback({
                userId: req.user.userId,
                type: type || 4,
                content: content.trim(),
                contact: contact || '',
                images: images || '[]'
            });
            
            res.success(result, 'Feedback submitted successfully');
        } catch (error) {
            next(error);
        }
    },
    
    async getFeedbackList(req, res, next) {
        try {
            const { page = 1, pageSize = 10 } = req.query;
            const result = await feedbackService.getFeedbackList(req.user.userId, parseInt(page), parseInt(pageSize));
            res.paginate(result.list, result.total, page, pageSize);
        } catch (error) {
            next(error);
        }
    },
    
    async getFeedbackDetail(req, res, next) {
        try {
            const { id } = req.params;
            const feedback = await feedbackService.getFeedbackById(id, req.user.userId);
            
            if (!feedback) {
                throw new AppError('Feedback not found', 404, 404);
            }
            
            res.success(feedback);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = feedbackController;
