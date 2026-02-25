jest.setTimeout(10000);

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = '';
process.env.DB_NAME = 'metacity_test';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
