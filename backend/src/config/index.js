const config = {
    app: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    },
    
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'metacity',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    },
    
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || '',
        db: parseInt(process.env.REDIS_DB) || 0
    },
    
    jwt: {
        secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    },
    
    sms: {
        accessKey: process.env.SMS_ACCESS_KEY || '',
        secretKey: process.env.SMS_SECRET_KEY || '',
        signName: process.env.SMS_SIGN_NAME || '元城市',
        templateCode: process.env.SMS_TEMPLATE_CODE || ''
    },
    
    oss: {
        endpoint: process.env.OSS_ENDPOINT || '',
        accessKeyId: process.env.OSS_ACCESS_KEY_ID || '',
        accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || '',
        bucket: process.env.OSS_BUCKET || 'metacity'
    },
    
    pagination: {
        defaultPage: 1,
        defaultPageSize: 20,
        maxPageSize: 100
    },
    
    sign: {
        basePoints: 10,
        continuousBonus: {
            3: 5,
            7: 20
        }
    },
    
    points: {
        sources: {
            daily_sign: 'daily_sign',
            complete_profile: 'complete_profile',
            bind_phone: 'bind_phone',
            invite_friend: 'invite_friend',
            activity: 'activity'
        },
        amounts: {
            daily_sign: 10,
            complete_profile: 50,
            bind_phone: 30,
            invite_friend: 100
        }
    }
};

module.exports = config;
