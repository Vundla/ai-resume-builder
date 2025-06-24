app.post('/api/save-data', (req, res) => {
  const { sessionId, data } = req.body;
  const sql = `INSERT OR REPLACE INTO users (sessionId, data) VALUES (?, ?)`;
  db.run(sql, [sessionId, JSON.stringify(data)], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to save data' });
    }
    res.json({ success: true });
  });
});
