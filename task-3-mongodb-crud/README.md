## For Task 3
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

## For Task 4

## 🔧 Overview
Added PUT, PATCH, and DELETE operations to the MongoDB CRUD API.

## ✨ Features
- **PUT** - Full replacement of episode data
- **PATCH** - Partial update (only provided fields)
- **DELETE** - Remove episodes from database
- Returns updated document (not the old one)
- 400 Bad Request for invalid MongoDB ObjectIds
- 404 Not Found for missing episodes
- Prevents updates to original TVMaze ID
- Auto-updates `updatedAt` timestamp

## 📊 New API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/episodes/:id` | Full update |
| PATCH | `/api/episodes/:id` | Partial update |
| DELETE | `/api/episodes/:id` | Delete episode |

## 🧪 Test with cURL

### PUT - Full Update
```bash
curl -X PUT http://localhost:3002/api/episodes/ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "season": 5,
    "number": 16,
    "airdate": "2013-09-29",
    "summary": "Complete replacement!"
  }'