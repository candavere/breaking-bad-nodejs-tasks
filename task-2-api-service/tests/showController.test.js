import request from 'supertest';
import express from 'express';
import showRoutes from '../src/routes/showRoutes.js';
const app = express();
app.use(express.json());
app.use('/api', showRoutes);
describe('Breaking Bad API Tests', () => {
  describe('GET /api/show-details', () => {
    test('should return show details with correct fields', async () => {
      const response = await request(app)
        .get('/api/show-details')
        .expect(200);

      expect(response.body).toHaveProperty('name', 'Breaking Bad');
      expect(response.body).toHaveProperty('genres');
      expect(response.body).toHaveProperty('rating');
      expect(response.body).toHaveProperty('premiered');
      expect(response.body).toHaveProperty('summary');
      expect(response.body).toHaveProperty('_cached');
    });
    test('should have caching headers', async () => {
      const response = await request(app)
        .get('/api/show-details')
        .expect(200);
      
      expect(response.body).toHaveProperty('_cached');
      expect(response.body).toHaveProperty('_cacheTimestamp');
    });
  });
  describe('GET /api/episodes', () => {
    test('should return all episodes', async () => {
      const response = await request(app)
        .get('/api/episodes')
        .expect(200);      
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('episodes');
      expect(Array.isArray(response.body.episodes)).toBe(true);
      expect(response.body.total).toBeGreaterThan(0);
    });
    test('should return episode with correct fields', async () => {
      const response = await request(app)
        .get('/api/episodes')
        .expect(200);      
      const firstEpisode = response.body.episodes[0];
      expect(firstEpisode).toHaveProperty('id');
      expect(firstEpisode).toHaveProperty('name');
      expect(firstEpisode).toHaveProperty('season');
      expect(firstEpisode).toHaveProperty('number');
      expect(firstEpisode).toHaveProperty('airdate');
      expect(firstEpisode).toHaveProperty('summary');
    });
  });
  describe('GET /api/episodes?search=', () => {
    test('should filter episodes by search query', async () => {
      const response = await request(app)
        .get('/api/episodes?search=pilot')
        .expect(200);      
      expect(response.body._searchApplied).toBe(true);
      expect(response.body._searchQuery).toBe('pilot');
      expect(response.body.episodes.length).toBeGreaterThan(0);
      response.body.episodes.forEach(ep => {
        const nameMatch = ep.name.toLowerCase().includes('pilot');
        const summaryMatch = ep.summary && ep.summary.toLowerCase().includes('pilot');
        expect(nameMatch || summaryMatch).toBe(true);
      });
    });
    test('should return empty array for no matches', async () => {
      const response = await request(app)
        .get('/api/episodes?search=xyzabc123')
        .expect(200);     
      expect(response.body.episodes).toEqual([]);
      expect(response.body.total).toBe(0);
    });
  });
  describe('Error Handling', () => {
    test('should return 404 for invalid endpoint', async () => {
      const response = await request(app)
        .get('/api/invalid-endpoint')
        .expect(404);     
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Endpoint not found');
    });
  });
});