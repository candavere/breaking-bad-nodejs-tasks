import axios from 'axios';
import { cache } from '../services/cacheService.js';
export const getShowDetails = async (req, res) => {
  try {
    const cacheKey = 'breaking-bad-show-details';
    
    // Check cache first
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        ...cachedData,
        _cached: true,
        _cacheTimestamp: new Date().toISOString()
      });
    }
    const response = await axios.get(
      'https://api.tvmaze.com/singlesearch/shows?q=breaking%20bad'
    );

    if (!response.data) {
      return res.status(404).json({
        error: 'Show not found'
      });
    }

    const show = response.data;
    const filteredShow = {
      id: show.id,
      name: show.name,
      genres: show.genres,
      rating: show.rating?.average || null,
      premiered: show.premiered,
      ended: show.ended,
      status: show.status,
      summary: show.summary,
      network: show.network?.name || null,
      schedule: show.schedule,
      image: show.image?.medium || null
    };
    await cache.set(cacheKey, filteredShow);

    res.status(200).json({
      ...filteredShow,
      _cached: false,
      _cacheTimestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching show details:', error);
    res.status(500).json({
      error: 'Failed to fetch show details',
      message: error.message
    });
  }
};
export const getEpisodes = async (req, res) => {
  try {
    const { search } = req.query;
    const cacheKey = `breaking-bad-episodes${search ? `:search:${search}` : ':all'}`;
    
    // Check cache
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        ...cachedData,
        _cached: true,
        _cacheTimestamp: new Date().toISOString()
      });
    }
    const showResponse = await axios.get(
      'https://api.tvmaze.com/singlesearch/shows?q=breaking%20bad'
    );
    const showId = showResponse.data.id;
   const episodesResponse = await axios.get(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    );
    let episodes = episodesResponse.data;
    if (search) {
      const searchLower = search.toLowerCase();
      episodes = episodes.filter(ep => 
        ep.name.toLowerCase().includes(searchLower) ||
        (ep.summary && ep.summary.toLowerCase().includes(searchLower))
      );
    }
    const filteredEpisodes = episodes.map(ep => ({
      id: ep.id,
      name: ep.name,
      season: ep.season,
      number: ep.number,
      airdate: ep.airdate,
      airtime: ep.airtime,
      runtime: ep.runtime,
      rating: ep.rating?.average || null,
      summary: ep.summary,
      image: ep.image?.medium || null
    }));
    const response = {
      total: filteredEpisodes.length,
      episodes: filteredEpisodes,
      _searchApplied: !!search,
      _searchQuery: search || null
    };
    await cache.set(cacheKey, response);

    res.status(200).json({
      ...response,
      _cached: false,
      _cacheTimestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching episodes:', error);
    res.status(500).json({
      error: 'Failed to fetch episodes',
      message: error.message
    });
  }
};