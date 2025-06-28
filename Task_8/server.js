const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Handle POST request to create file
app.post('/create-file', (req, res) => {
  const { filename, textdata } = req.body;

  if (!filename || !textdata) {
    return res.status(400).send('Filename and textdata are required.');
  }

  const safeFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '');
  const filePath = path.join(__dirname, 'public', `${safeFilename}.txt`);

  fs.writeFile(filePath, textdata, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send('Error creating file.');
    }
    res.send(`✅ File "${safeFilename}.txt" created successfully in /public`);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
