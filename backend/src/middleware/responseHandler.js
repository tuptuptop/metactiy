const responseHandler = (req, res, next) => {
    res.success = (data = null, message = 'Success', code = 0) => {
        return res.json({
            code,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    };
    
    res.error = (message = 'Error', code = -1, statusCode = 400) => {
        return res.status(statusCode).json({
            code,
            message,
            data: null,
            timestamp: new Date().toISOString()
        });
    };
    
    res.paginate = (list, total, page, pageSize) => {
        return res.success({
            list,
            total,
            page: parseInt(page) || 1,
            pageSize: parseInt(pageSize) || 20,
            totalPages: Math.ceil(total / (parseInt(pageSize) || 20))
        });
    };
    
    next();
};

module.exports = responseHandler;
