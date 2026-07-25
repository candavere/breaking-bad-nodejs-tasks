import express from 'express';
import cors from 'cors';
import showRoutes from './routes/showRoutes.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use('/api', showRoutes);
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Breaking Bad API'
  });
});
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.url}`
  });
});
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});
app.listen(PORT, () => {
  console.log('\n🚀 Breaking Bad API Server Started!');
  console.log('='.repeat(50));
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`📊 Show details: http://localhost:${PORT}/api/show-details`);
  console.log(`📺 All episodes: http://localhost:${PORT}/api/episodes`);
  console.log(`🔍 Search episodes: http://localhost:${PORT}/api/episodes?search=pilot`);
  console.log('='.repeat(50));
  console.log('Press Ctrl+C to stop the server\n');
});