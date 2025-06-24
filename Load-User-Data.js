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
