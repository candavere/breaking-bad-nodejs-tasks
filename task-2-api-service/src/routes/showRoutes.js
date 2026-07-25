import express from 'express';
import { getShowDetails, getEpisodes } from '../controllers/showController.js';
const router = express.Router();
router.get('/show-details', getShowDetails);
router.get('/episodes', getEpisodes);
export default router;