import express from 'express';
import * as episodeController from '../controllers/episodeController.js';

const router = express.Router();

router.post('/api/episodes', episodeController.createEpisode);
router.get('/api/episodes', episodeController.getAllEpisodes);
router.get('/api/episodes/:id', episodeController.getEpisodeById);
router.get('/api/seasons/:seasonNumber/episodes', episodeController.getEpisodesBySeason);
router.get('/api/seasons/:seasonNumber/episodes/:episodeNumber', episodeController.getEpisodeBySeasonAndNumber);

export default router;