const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// ✅ Fix: allow React app through CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(bodyParser.json());

// ✅ MongoDB connection
mongoose.connect('mongodb+srv://commentDB:rachna11@cluster0.edpp2cz.mongodb.net/commentDB?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Error:', err));

// ✅ Schema
const commentSchema = new mongoose.Schema({
  name: String,
  message: String,
});
const Comment = mongoose.model('Comment', commentSchema);

// ✅ Routes
app.get('/comments', async (req, res) => {
  const comments = await Comment.find();
  res.json(comments);
});

app.post('/add-comment', async (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).json({ error: 'Name and message required' });

  const newComment = new Comment({ name, message });
  await newComment.save();
  res.status(201).json({ message: 'Comment added successfully' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
