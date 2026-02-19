const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Enable CORS for frontend requests
app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, 'answers.json');

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// GET endpoints to retrieve all answers
app.get('/api/answers', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      // Return empty array if file issue, or create it
      return res.json([]);
    }
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      console.error('Error parsing JSON:', e);
      res.json([]);
    }
  });
});

// POST endpoint to submit a new answer
app.post('/api/submit', (req, res) => {
  const newAnswer = {
    id: Date.now().toString(), // ensuring ID is string
    timestamp: new Date().toISOString(),
    status: 'applicant', // Default status
    ...req.body
  };

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    let answers = [];
    if (!err && data) {
      try {
        answers = JSON.parse(data);
      } catch (e) {
        console.error('Error parsing JSON, starting fresh:', e);
        answers = [];
      }
    }

    // Add new answer to the beginning or end? End seems standard.
    answers.push(newAnswer);

    fs.writeFile(DATA_FILE, JSON.stringify(answers, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ error: 'Failed to save data' });
      }
      console.log('New submission saved:', newAnswer.id);
      res.status(201).json({ message: 'Success', id: newAnswer.id });
    });
  });
});

// PATCH endpoint to update status
app.patch('/api/answers/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading data' });

    let answers = JSON.parse(data);
    const index = answers.findIndex(a => a.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    answers[index].status = status;
    answers[index].updatedAt = new Date().toISOString();

    fs.writeFile(DATA_FILE, JSON.stringify(answers, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Error saving data' });
      res.json(answers[index]);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
