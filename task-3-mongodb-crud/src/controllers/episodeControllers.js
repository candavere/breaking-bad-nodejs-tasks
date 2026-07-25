import Episode from '../models/Episode.js';
export const createEpisode = async (req, res) => {
  try {
    const episode = new Episode(req.body);
    await episode.save();
    
    res.status(201).json({
      success: true,
      message: 'Episode created successfully',
      episode: episode.getInfo()
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Episode already exists',
        message: `Episode with ID ${req.body.id} already exists in the database`
      });
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        messages: errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create episode',
      message: error.message
    });
  }
};
export const getAllEpisodes = async (req, res) => {
  try {
    const { season, limit = 100, skip = 0 } = req.query;
    
    // Build filter
    const filter = {};
    if (season) {
      filter.season = parseInt(season);
    }    
    // Query database
    const episodes = await Episode.find(filter)
      .sort({ season: 1, number: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean(); // Returns plain JavaScript objects (better performance)
    
    const total = await Episode.countDocuments(filter);
    const seasons = await Episode.getSeasons();
    
    res.status(200).json({
      success: true,
      total,
      count: episodes.length,
      seasons: seasons.sort(),
      filterApplied: !!season,
      episodes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch episodes',
      message: error.message
    });
  }
};
export const getEpisodeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format',
        message: 'Please provide a valid MongoDB ObjectId'
      });
    }    
    const episode = await Episode.findById(id);   
    if (!episode) {
      return res.status(404).json({
        success: false,
        error: 'Episode not found',
        message: `No episode found with ID: ${id}`
      });
    }    
    res.status(200).json({
      success: true,
      episode
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch episode',
      message: error.message
    });
  }
};
export const getEpisodesBySeason = async (req, res) => {
  try {
    const { seasonNumber } = req.params;
    const season = parseInt(seasonNumber);   
    if (isNaN(season) || season < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid season number',
        message: 'Season number must be a positive integer'
      });
    }    
    const episodes = await Episode.find({ season })
      .sort({ number: 1 })
      .lean();    
    if (episodes.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Season not found',
        message: `No episodes found for season ${season}`
      });
    }
    const ratings = episodes.map(ep => ep.rating).filter(r => r !== null);
    const avgRating = ratings.length > 0 
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : null;    
    res.status(200).json({
      success: true,
      season,
      totalEpisodes: episodes.length,
      averageRating: avgRating,
      episodes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch episodes',
      message: error.message
    });
  }
};
export const getEpisodeBySeasonAndNumber = async (req, res) => {
  try {
    const { seasonNumber, episodeNumber } = req.params;
    const season = parseInt(seasonNumber);
    const number = parseInt(episodeNumber);    
    if (isNaN(season) || isNaN(number) || season < 1 || number < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid parameters',
        message: 'Season and episode numbers must be positive integers'
      });
    }    
    const episode = await Episode.findOne({ season, number }).lean();    
    if (!episode) {
      return res.status(404).json({
        success: false,
        error: 'Episode not found',
        message: `Episode ${episodeNumber} not found in season ${seasonNumber}`
      });
    }    
    res.status(200).json({
      success: true,
      episode
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch episode',
      message: error.message
    });
  }
};
import mongoose from 'mongoose';