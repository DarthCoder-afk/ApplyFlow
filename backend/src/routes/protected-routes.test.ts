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

    it('rejects unauthenticated profile and avatar requests', async () => {
        const profileResponse = await request(app).get('/api/profile');
        const avatarResponse = await request(app)
            .post('/api/profile/avatar')
            .attach('avatar', Buffer.from([0xff, 0xd8, 0xff]), {
                filename: 'avatar.jpg',
                contentType: 'image/jpeg',
            });

        expect(profileResponse.status).toBe(401);
        expect(avatarResponse.status).toBe(401);
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

    it('rejects an invalid access token', async () => {
        const response = await request(app)
            .get('/api/jobs')
            .set('Authorization', 'Bearer not-a-real-token');
        
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: 'Invalid or expired access token',
        });
    });

    it('returns the API health status', async () => {
        const response = await request(app).get('/api/health')
            
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status:  'OK',
            message: 'Job Tracker API is running',
        });
    });
});
