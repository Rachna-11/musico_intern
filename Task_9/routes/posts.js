const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

    
router.post('/', async (req, res) => {
  try {
    console.log('Request Body:', req.body); 
    const post = new Post(req.body);
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
