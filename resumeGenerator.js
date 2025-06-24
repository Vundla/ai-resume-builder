// resumeBuilder.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "API"
// Database setup
const db = new sqlite3.Database('./resumeBuilder.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to SQLite database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sessionId TEXT UNIQUE,
    data TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Corrected route definitions
app.post('/api/generate-resume', async (req, res) => {
  // Generate resume implementation
});

app.post('/api/save-data', (req, res) => {
  // Save data implementation
});

// Fixed route parameter definition
app.get('/api/load-data/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const query = `SELECT data FROM users WHERE sessionId = ?`;
  
  db.get(query, [sessionId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to load data' });
    }
    res.json(row ? JSON.parse(row.data) : null);
  });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});