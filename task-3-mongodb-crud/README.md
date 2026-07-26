## 🗄️ Overview
A MongoDB database API for Breaking Bad episodes with full CRUD operations.

## ✨ Features
- Create new episodes (POST)
- Get all episodes (GET)
- Get episode by ID (GET)
- Get episodes by season (GET)
- Get specific episode by season & number (GET)
- Data seeding from TVMaze API (62 episodes)
- Automatic timestamps (createdAt, updatedAt)
- Schema validation

## 🛠️ Technologies
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose ODM
- Axios (TVMaze API)
- dotenv (environment variables)

## 📊 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/episodes` | Create episode |
| GET | `/api/episodes` | All episodes |
| GET | `/api/episodes/:id` | Episode by ID |
| GET | `/api/seasons/:season/episodes` | Episodes by season |
| GET | `/api/seasons/:season/episodes/:number` | Specific episode |
| GET | `/health` | Health check |
