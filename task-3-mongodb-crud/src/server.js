const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));
const episodeSchema = new mongoose.Schema({
  id: { 
    type: Number, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  season: { 
    type: Number, 
    required: true 
  },
  number: { 
    type: Number, 
    required: true 
  },
  airdate: { 
    type: String, 
    required: true 
  },
  summary: { 
    type: String 
  },
  rating: { 
    type: Number, 
    default: null 
  },
  image: { 
    type: String, 
    default: null 
  }
}, { 
  timestamps: true 
});
episodeSchema.index({ id: 1 }, { unique: true });

const Episode = mongoose.model('Episode', episodeSchema);
app.use(cors());
app.use(express.json());
app.post('/api/episodes', async (req, res) => {
  try {
    const episode = new Episode(req.body);
    await episode.save();
    res.status(201).json({ 
      success: true, 
      message: 'Episode created!', 
      episode 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        error: 'Episode already exists' 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
app.get('/api/episodes', async (req, res) => {
  try {
    const episodes = await Episode.find().sort({ season: 1, number: 1 });
    res.status(200).json({ 
      success: true, 
      total: episodes.length, 
      episodes 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
app.get('/api/episodes/:id', async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) {
      return res.status(404).json({ 
        success: false, 
        error: 'Episode not found' 
      });
    }
    res.status(200).json({ success: true, episode });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
app.get('/api/seasons/:seasonNumber/episodes', async (req, res) => {
  try {
    const season = parseInt(req.params.seasonNumber);
    const episodes = await Episode.find({ season }).sort({ number: 1 });
    
    if (episodes.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: `No episodes found for season ${season}` 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      season, 
      total: episodes.length, 
      episodes 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
app.get('/api/seasons/:seasonNumber/episodes/:episodeNumber', async (req, res) => {
  try {
    const season = parseInt(req.params.seasonNumber);
    const number = parseInt(req.params.episodeNumber);
    
    const episode = await Episode.findOne({ season, number });
    
    if (!episode) {
      return res.status(404).json({ 
        success: false, 
        error: `Episode ${number} not found in season ${season}` 
      });
    }   
    res.status(200).json({ success: true, episode });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ 
    success: false, 
    error: 'Internal Server Error',
    message: err.message 
  });
});
app.listen(PORT, () => {
  console.log('\n🚀 Breaking Bad API Server Started!');
  console.log('='.repeat(50));
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📺 GET  /api/episodes`);
  console.log(`📺 POST /api/episodes`);
  console.log(`📺 GET  /api/episodes/:id`);
  console.log(`📺 GET  /api/seasons/:season/episodes`);
  console.log(`📺 GET  /api/seasons/:season/episodes/:episode`);
  console.log(`💚 GET  /health`);
  console.log('='.repeat(50));
  console.log('Press Ctrl+C to stop\n');
});