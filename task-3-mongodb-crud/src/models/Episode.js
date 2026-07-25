import mongoose from 'mongoose';
const episodeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    immutable: true,
    description: 'Original TVMaze episode ID'
  },
  name: {
    type: String,
    required: [true, 'Episode name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  season: {
    type: Number,
    required: [true, 'Season number is required'],
    min: [1, 'Season must be at least 1'],
    max: [6, 'Breaking Bad has only 5 seasons']
  },
  number: {
    type: Number,
    required: [true, 'Episode number is required'],
    min: [1, 'Episode number must be at least 1']
  },
  airdate: {
    type: String,
    required: [true, 'Air date is required'],
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Please use YYYY-MM-DD format']
  },
  summary: {
    type: String,
    trim: true,
    maxlength: [5000, 'Summary cannot exceed 5000 characters']
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});
episodeSchema.index({ season: 1, number: 1 });
episodeSchema.index({ id: 1 }, { unique: true });
episodeSchema.index({ name: 'text' });
episodeSchema.virtual('fullId').get(function() {
  return `S${String(this.season).padStart(2, '0')}E${String(this.number).padStart(2, '0')}`;
});
episodeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});
episodeSchema.methods.getInfo = function() {
  return {
    id: this.id,
    name: this.name,
    season: this.season,
    number: this.number,
    fullId: this.fullId,
    airdate: this.airdate,
    rating: this.rating
  };
};
episodeSchema.statics.findBySeasonAndNumber = function(season, number) {
  return this.findOne({ season, number });
};
episodeSchema.statics.getSeasons = function() {
  return this.distinct('season').sort();
};
export default mongoose.model('Episode', episodeSchema);