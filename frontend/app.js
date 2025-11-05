// Figure out where the backend API is
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : `http://${window.location.hostname}:3000`;

// When page loads, get messages from database
document.addEventListener('DOMContentLoaded', loadMessages);

// When form is submitted, save new message
document.getElementById('messageForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Don't refresh page
    
    // Get values from form
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    
    try {
        // Send POST request to backend
        const response = await fetch(`${API_URL}/api/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, message }),
        });
        
        if (response.ok) {
            // Clear form
            document.getElementById('messageForm').reset();
            // Reload messages
            loadMessages();
        } else {
            alert('Error submitting message');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error connecting to server');
    }
});

// Function to load and display messages
async function loadMessages() {
    try {
        // Get messages from backend
        const response = await fetch(`${API_URL}/api/messages`);
        const messages = await response.json();
        
        // Create HTML for each message
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = messages.map(msg => `
            <div class="message-card">
                <h3>${escapeHtml(msg.name)}</h3>
                <p>${escapeHtml(msg.message)}</p>
                <small>${new Date(msg.created_at).toLocaleString()}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Security: escape HTML to prevent attacks
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}