import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import Episode from './models/Episode.js';
dotenv.config();
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');
    console.log('='.repeat(50));


    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const deleteResult = await Episode.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing episodes`);


    console.log('📡 Fetching show information from TVMaze...');
    const showResponse = await axios.get(
      'https://api.tvmaze.com/singlesearch/shows?q=breaking%20bad'
    );
    const showId = showResponse.data.id;
    console.log(`📺 Found show: ${showResponse.data.name} (ID: ${showId})`);

    console.log('📡 Fetching episodes from TVMaze...');
    const episodesResponse = await axios.get(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    );
    const episodes = episodesResponse.data;
    console.log(`📦 Found ${episodes.length} episodes`);

    const formattedEpisodes = episodes.map(ep => ({
      id: ep.id,
      name: ep.name,
      season: ep.season,
      number: ep.number,
      airdate: ep.airdate,
      summary: ep.summary,
      rating: ep.rating?.average || null,
      image: ep.image?.medium || null
    }));

    const result = await Episode.insertMany(formattedEpisodes, {
      ordered: false 
    });
    
    console.log(`✅ Successfully inserted ${result.length} episodes`);
    
    const totalEpisodes = await Episode.countDocuments();
    const totalSeasons = await Episode.distinct('season');
    
    console.log('\n📊 Database Statistics:');
    console.log(`   Total Episodes: ${totalEpisodes}`);
    console.log(`   Total Seasons: ${totalSeasons.length}`);
    console.log(`   Seasons: ${totalSeasons.sort().join(', ')}`);
    console.log('='.repeat(50));
    console.log('🌱 Database seed complete!');

  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    
    if (error.code === 11000) {
      console.error('⚠️  Duplicate key error - some episodes already exist');
    }
    
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};
seedDatabase();