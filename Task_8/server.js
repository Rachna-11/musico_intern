const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/create-file', (req, res) => {
  const { filename, textdata } = req.body;

  const filePath = path.join(__dirname, 'public', `${filename}.txt`);

  fs.writeFile(filePath, textdata, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send('Failed to create file.');
    }
    res.send(`File "${filename}.txt" created successfully in public folder.`);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
