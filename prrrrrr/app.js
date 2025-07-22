const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Atlas Connection URI
const uri = "mongodb+srv://commentDB:rachna11@cluster0.edpp2cz.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0";

// Mongoose Schema
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Mongoose connected'))
  .catch(err => console.error('❌ Mongoose connection error', err));

const replySchema = new mongoose.Schema({
  name: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  name: String,
  message: String,
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'comments.html'));
});

// Get all comments
app.get('/comments', async (req, res) => {
  const comments = await Comment.find().sort({ createdAt: -1 });
  res.json(comments);
});

// Add comment
app.post('/add-comment', async (req, res) => {
  const { name, message } = req.body;
  await Comment.create({ name, message });
  res.redirect('/');
});

// Add reply
app.post('/add-reply/:id', async (req, res) => {
  const { name, message } = req.body;
  await Comment.findByIdAndUpdate(req.params.id, {
    $push: { replies: { name, message } }
  });
  res.sendStatus(200);
});

// Delete comment
app.delete('/delete-comment/:id', async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

// Delete reply
app.delete('/delete-reply/:commentId/:replyId', async (req, res) => {
  const { commentId, replyId } = req.params;
  await Comment.updateOne(
    { _id: commentId },
    { $pull: { replies: { _id: replyId } } }
  );
  res.sendStatus(200);
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
