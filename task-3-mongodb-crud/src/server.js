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
//Task 4: Mike's Cleanup crew

app.put('/api/episodes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format',
        message: 'Please provide a valid MongoDB ObjectId'
      });
    }
    const existingEpisode = await Episode.findById(id);
    if (!existingEpisode) {
      return res.status(404).json({
        success: false,
        error: 'Episode not found',
        message: `No episode found with ID: ${id}`
      });
    }
    if (req.body.id && req.body.id !== existingEpisode.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot update original TVMaze ID field',
        message: 'The TVMaze ID is immutable'
      });
    }
    delete req.body.id;
    const updatedEpisode = await Episode.findByIdAndUpdate(
      id,                                    // Find by ID
      { 
        ...req.body,                        
        updatedAt: new Date()                
      },
      { 
        new: true,                          
        runValidators: true                  
      }
    );
    res.status(200).json({
      success: true,
      message: 'Episode fully updated (PUT)',
      episode: updatedEpisode
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        messages: errors
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to update episode',
      message: error.message
    });
  }
});
app.patch('/api/episodes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format',
        message: 'Please provide a valid MongoDB ObjectId'
      });
    }
    const existingEpisode = await Episode.findById(id);
    if (!existingEpisode) {
      return res.status(404).json({
        success: false,
        error: 'Episode not found',
        message: `No episode found with ID: ${id}`
      });
    }
    if (req.body.id && req.body.id !== existingEpisode.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot update original TVMaze ID field',
        message: 'The TVMaze ID is immutable'
      });
    }
    delete req.body.id;
    const fieldsToUpdate = Object.keys(req.body);
    const updatedEpisode = await Episode.findByIdAndUpdate(
      id,
      { 
        ...req.body,
        updatedAt: new Date()
      },
      { 
        new: true,
        runValidators: true
      }
    );
    res.status(200).json({
      success: true,
      message: 'Episode partially updated (PATCH)',
      updatedFields: fieldsToUpdate,
      episode: updatedEpisode
    }); 
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        messages: errors
      });
    }    
    res.status(500).json({
      success: false,
      error: 'Failed to update episode',
      message: error.message
    });
  }
});
app.delete('/api/episodes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format',
        message: 'Please provide a valid MongoDB ObjectId'
      });
    }
    const deletedEpisode = await Episode.findByIdAndDelete(id);
    if (!deletedEpisode) {
      return res.status(404).json({
        success: false,
        error: 'Episode not found',
        message: `No episode found with ID: ${id}`
      });
    }    
    res.status(200).json({
      success: true,
      message: 'Episode deleted successfully',
      episode: deletedEpisode
    });    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete episode',
      message: error.message
    });
  }
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