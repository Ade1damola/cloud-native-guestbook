// This loads the packages we need
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

// Create the app
const app = express();
const port = 3000;

// Connect to database
// process.env.DB_HOST means "get DB_HOST from environment variables"
const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Middleware (stuff that runs before our routes)
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json()); // Lets us read JSON data

// Health check - just to see if server is alive
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Get all messages from database
app.get('/api/messages', async (req, res) => {
  try {
    // Run SQL query to get all messages
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    // Send back the messages
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add a new message
app.post('/api/messages', async (req, res) => {
  // Get name and message from request body
  const { name, message } = req.body;
  
  try {
    // Insert into database
    const result = await pool.query(
      'INSERT INTO messages (name, message) VALUES ($1, $2) RETURNING *',
      [name, message]
    );
    // Send back the new message
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
