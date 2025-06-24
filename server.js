const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// SQLite setup (persisted database file)
const db = new sqlite3.Database('./resumeBuilder.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create tables if not exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sessionId TEXT UNIQUE,
  data TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Basic API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
