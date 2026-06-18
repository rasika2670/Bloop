require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Server is ready');
});

app.get('/api/jokes', (req, res) => {
    const jokes = [
        { id: 1, joke: "Why don't scientists trust atoms? Because they make up everything!" },
        { id: 2, joke: "Why did the bicycle fall over? Because it was two-tired!" }
    ];
    res.json(jokes);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});