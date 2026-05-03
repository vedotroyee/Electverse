require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'place_holder_key');
const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest",
  systemInstruction: "You are ElectVerse Guide, an expert election education assistant. You ONLY answer questions about elections, voting systems, democracy, electoral processes, candidates, political parties, voting rights, election history, and related civic topics worldwide. If asked anything outside this scope, politely redirect back to elections. Keep answers under 120 words. Use simple language. End every answer with one relevant follow-up question to keep learning going. Occasionally use a relevant emoji.",
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/electverse';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB (ElectVerse)'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

// --- AI Chat Endpoint ---
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Format messages for Gemini (map 'assistant' to 'model')
    const chatHistory = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    
    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    res.json({ content: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    if (error.status === 429) {
      res.status(429).json({ message: "quota_exceeded" });
    } else {
      res.status(500).json({ message: "AI error occurred" });
    }
  }
});

// --- News Endpoint ---
app.get('/api/news', async (req, res) => {
  try {
    const { region } = req.query;
    const apiKey = process.env.GNEWS_API_KEY;
    const query = region && region !== 'World' ? `election ${region}` : 'election';
    
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${apiKey}`;
    
    const response = await axios.get(url);
    res.json(response.data.articles);
  } catch (error) {
    console.error("GNews Error:", error);
    // Fallback logic handled in frontend
    res.status(error.response?.status || 500).json({ message: "News fetch failed" });
  }
});

// 1. Register or Login
app.post('/api/users', async (req, res) => {
  try {
    const { name, country, purpose } = req.body;
    
    // Find existing or create new
    let user = await User.findOne({ name, country });
    if (!user) {
      user = new User({ name, country, purpose });
      await user.save();
    } else {
      // Update purpose if it changed
      user.purpose = purpose;
      await user.save();
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Fetch User by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Update Progress (Systems Viewed)
app.put('/api/users/:id/progress', async (req, res) => {
  try {
    const { systemId } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.systemsViewed.includes(systemId)) {
      user.systemsViewed.push(systemId);
      await user.save();
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Update Quiz Result
app.put('/api/users/:id/quiz', async (req, res) => {
  try {
    const { result } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { quizResult: result },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
