// Import the express library.
const express = require('express');
const app = express();
// This service will run on a different port.
const PORT = 8080;

// Tell Express to serve all static files (like index.html) 
// from the current directory.
app.use(express.static(__dirname));

// Start the server.
app.listen(PORT, () => {
    console.log(`Frontend service running on port ${PORT}`);
});