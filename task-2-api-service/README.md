## Overview:
A REST API that provides Breaking Bad Show and Episode data from the TVMAZE API.

## Features:
- Get show details (name, genre, rating, summary, etc.)
- Get all 62 episodes with season/episode numbers
- Search episodes by name or summary
- In-memory caching for performance

## Tech Stacks Used:
- Node.js
- Express.js
- Axios
- Jest & Supertest (for testing)

## Quick Start
npm install
npm start

## Test in Browser
http://localhost:3000/api/show-details

http://localhost:3000/api/episodes

http://localhost:3000/api/episodes?search=pilot

"I am the one who knocks." - Walter White