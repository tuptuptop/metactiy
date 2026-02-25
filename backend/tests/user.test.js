const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');
const redisClient = require('../src/config/redis');

describe('User API Tests', () => {
    beforeAll(async () => {
        await redisClient.connect();
    });
    
    afterAll(async () => {
        await redisClient.disconnect();
        await db.pool.end();
    });
    
    describe('POST /api/user/sms/send', () => {
        it('should send SMS code successfully', async () => {
            const response = await request(app)
                .post('/api/user/sms/send')
                .send({ phone: '13800138000' });
            
            expect(response.status).toBe(200);
            expect(response.body.code).toBe(0);
            expect(response.body.data.success).toBe(true);
        });
        
        it('should return error for invalid phone', async () => {
            const response = await request(app)
                .post('/api/user/sms/send')
                .send({ phone: '12345' });
            
            expect(response.status).toBe(400);
            expect(response.body.code).toBe(400);
        });
    });
    
    describe('POST /api/user/register', () => {
        it('should return error for missing phone', async () => {
            const response = await request(app)
                .post('/api/user/register')
                .send({
                    password: 'Test@123',
                    code: '123456'
                });
            
            expect(response.status).toBe(400);
        });
        
        it('should return error for invalid code format', async () => {
            const response = await request(app)
                .post('/api/user/register')
                .send({
                    phone: '13800138000',
                    password: 'Test@123',
                    code: '123'
                });
            
            expect(response.status).toBe(400);
        });
    });
    
    describe('POST /api/user/login', () => {
        it('should return error for missing credentials', async () => {
            const response = await request(app)
                .post('/api/user/login')
                .send({
                    phone: '13800138000'
                });
            
            expect(response.status).toBe(400);
        });
        
        it('should return error for invalid login type', async () => {
            const response = await request(app)
                .post('/api/user/login')
                .send({
                    phone: '13800138000',
                    loginType: 'invalid'
                });
            
            expect(response.status).toBe(400);
        });
    });
    
    describe('GET /api/user/info', () => {
        it('should return error without token', async () => {
            const response = await request(app)
                .get('/api/user/info');
            
            expect(response.status).toBe(401);
        });
    });
    
    describe('GET /api/user/center', () => {
        it('should return error without token', async () => {
            const response = await request(app)
                .get('/api/user/center');
            
            expect(response.status).toBe(401);
        });
    });
});
