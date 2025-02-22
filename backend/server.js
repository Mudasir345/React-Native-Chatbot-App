const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import 'path' module to work with file paths
const cors = require('cors');
require('dotenv').config(); // .env file ko load karne ke liye
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 5500;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// CORS middleware
app.use(cors());

// POST endpoint to receive user query and return response
app.post('/query', async (req, res) => {
    try {
        const prompt = req.body.query;
        const result = await genAI.getGenerativeModel({ model: "gemini-pro"}).generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        res.json({ response: text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

// Error handling middleware for parsing errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        res.status(400).json({ error: 'Invalid JSON payload' });
    } else {
        next();
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
