const request = require('supertest');
const app = require('../src/app');

describe('Sign API Tests', () => {
    describe('POST /api/sign/do', () => {
        it('should return error without token', async () => {
            const response = await request(app)
                .post('/api/sign/do');
            
            expect(response.status).toBe(401);
        });
    });
    
    describe('GET /api/sign/status', () => {
        it('should return error without token', async () => {
            const response = await request(app)
                .get('/api/sign/status');
            
            expect(response.status).toBe(401);
        });
    });
    
    describe('GET /api/sign/records', () => {
        it('should return error without token', async () => {
            const response = await request(app)
                .get('/api/sign/records');
            
            expect(response.status).toBe(401);
        });
    });
});
