// Import the express library to easily build a web server.
const express = require('express');
// Import cors (Cross-Origin Resource Sharing) so our frontend, which
// is on a different port/address, can talk to this backend.
const cors = require('cors');

// Create the web application instance.
const app = express();
// The port the server will listen on inside the Docker container.
const PORT = 3000;

// Tell the app to use the CORS middleware.
app.use(cors());

// --- MOCKED DATABASE CONNECTION ---
// Normally, you would use a package like 'pg' or 'mysql2' here
// to connect to your AWS RDS database. For this simple version,
// we'll just pretend we fetched a quote.
// The real database connection details will be added later using
// environment variables (secrets).

// Define the API endpoint. When the frontend asks for '/quote', this runs.
app.get('/quote', (req, res) => {
    // This is the data we would get from the database.
    const quoteData = {
        quote: "The best way to predict the future is to create it.",
        author: "Peter Drucker",
        timestamp: new Date().toISOString()
    };
    
    // Send the data back to the frontend as a JSON object.
    res.json(quoteData);
});

// Start the server and listen on the defined port.
app.listen(PORT, () => {
    // Print a confirmation message to the Codespaces console.
    console.log(`Backend service running on port ${PORT}`);
});