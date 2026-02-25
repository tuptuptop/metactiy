const request = require('supertest');
const app = require('../src/app');

describe('City API Tests', () => {
    describe('GET /api/city/list', () => {
        it('should return city list with default pagination', async () => {
            const response = await request(app)
                .get('/api/city/list');
            
            expect(response.status).toBe(200);
            expect(response.body.code).toBe(0);
            expect(response.body.data).toHaveProperty('list');
            expect(response.body.data).toHaveProperty('total');
        });
        
        it('should return city list with pagination params', async () => {
            const response = await request(app)
                .get('/api/city/list')
                .query({ page: 1, pageSize: 10 });
            
            expect(response.status).toBe(200);
            expect(response.body.code).toBe(0);
        });
    });
    
    describe('GET /api/city/category', () => {
        it('should return city categories', async () => {
            const response = await request(app)
                .get('/api/city/category');
            
            expect(response.status).toBe(200);
            expect(response.body.code).toBe(0);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });
    
    describe('GET /api/city/hot', () => {
        it('should return hot cities', async () => {
            const response = await request(app)
                .get('/api/city/hot')
                .query({ limit: 5 });
            
            expect(response.status).toBe(200);
            expect(response.body.code).toBe(0);
        });
    });
    
    describe('GET /api/city/search', () => {
        it('should return error without keyword', async () => {
            const response = await request(app)
                .get('/api/city/search');
            
            expect(response.status).toBe(400);
        });
        
        it('should return search results with keyword', async () => {
            const response = await request(app)
                .get('/api/city/search')
                .query({ keyword: '北京' });
            
            expect(response.status).toBe(200);
            expect(response.body.code).toBe(0);
        });
    });
    
    describe('GET /api/city/detail/:id', () => {
        it('should return error for non-existent city', async () => {
            const response = await request(app)
                .get('/api/city/detail/nonexistent');
            
            expect(response.status).toBe(404);
        });
    });
});
