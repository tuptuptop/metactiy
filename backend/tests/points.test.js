const request = require('supertest');
const app = require('../src/app');

describe('Points API Tests', () => {
    describe('GET /api/points/balance', () => {
        it('should return error without token', async () => {
            const response = await request(app)
                .get('/api/points/balance');
            
            expect(response.status).toBe(401);
        });
    });
    
    describe('GET /api/points/records', () => {
        it('should return error without token', async () => {
            const response = await request(app)
                .get('/api/points/records');
            
            expect(response.status).toBe(401);
        });
    });
    
    describe('POST /api/points/earn', () => {
        it('should return error without token', async () => {
            const response = await request(app)
                .post('/api/points/earn')
                .send({ amount: 100, source: 'test' });
            
            expect(response.status).toBe(401);
        });
    });
    
    describe('POST /api/points/spend', () => {
        it('should return error without token', async () => {
            const response = await request(app)
                .post('/api/points/spend')
                .send({ amount: 50 });
            
            expect(response.status).toBe(401);
        });
    });
});
