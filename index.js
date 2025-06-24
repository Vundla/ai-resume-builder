const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { generateResume } = require('./resumeGenerator');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// SQLite database setup
const db = new sqlite3.Database('./resumeBuilder.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to the SQLite database.');
});

// Create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sessionId TEXT UNIQUE,
    data TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// API endpoint to generate resume content
app.post('/api/generate-resume', async (req, res) => {
  try {
    const { userInput, templateId } = req.body;
    const resumeContent = await generateResume(openai, userInput, templateId);
    res.json(resumeContent);
  } catch (error) {
    console.error('Error generating resume:', error);
    res.status(500).json({ error: 'Failed to generate resume' });
  }
});

// API endpoint to save user data
app.post('/api/save-data', (req, res) => {
  const { sessionId, data } = req.body;
  const query = `INSERT OR REPLACE INTO users (sessionId, data) VALUES (?, ?)`;
  db.run(query, [sessionId, JSON.stringify(data)], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to save data' });
    }
    res.json({ success: true });
  });
});

// API endpoint to load user data
app.get('/api/load-data/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  db.get(`SELECT data FROM users WHERE sessionId = ?`, [sessionId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to load data' });
    }
    res.json(row ? JSON.parse(row.data) : null);
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});