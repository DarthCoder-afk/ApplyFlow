import request from 'supertest';
import app from '../app';

describe('protected routes', () => {
    it('rejects an unauthenticated jobs request', async () => {
        const response = await request(app).get('/api/jobs');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: 'Access token required',
        });
    });

    it('rejects an unauthenticated applications request', async () => {
        const response = await request(app).get('/api/applications');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: 'Access token required',
        });
    });

    it('rejects an invalid access token', async () => {
        const response = await request(app)
            .get('/api/jobs')
            .set('Authorization', 'Bearer invalid-token');
        
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: 'Invalid or expired access token',
        });
    });
});