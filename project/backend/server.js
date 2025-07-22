const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB (replace with your real URI)
mongoose.connect('mongodb://127.0.0.1:27017/comments')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schema
const commentSchema = new mongoose.Schema({
  username: String,
  text: String
});

const Comment = mongoose.model('Comment', commentSchema);

// Routes
app.get('/comments', async (req, res) => {
  const comments = await Comment.find();
  res.json(comments);
});

app.post('/comments', async (req, res) => {
  const { username, text } = req.body;
  const newComment = new Comment({ username, text });
  await newComment.save();
  res.status(201).json(newComment);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});