const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./resumeBuilder.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});
