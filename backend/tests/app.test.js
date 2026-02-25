const request = require('supertest');
const app = require('../src/app');

describe('Health Check', () => {
    it('should return ok status', async () => {
        const response = await request(app)
            .get('/health');
        
        expect(response.status).toBe(200);
        expect(response.body.code).toBe(0);
        expect(response.body.data.status).toBe('ok');
    });
});

describe('API Health Check', () => {
    it('should return ok status for API health', async () => {
        const response = await request(app)
            .get('/api/health');
        
        expect(response.status).toBe(200);
        expect(response.body.code).toBe(0);
    });
});

describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
        const response = await request(app)
            .get('/unknown-route');
        
        expect(response.status).toBe(404);
    });
});
