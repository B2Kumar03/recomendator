import express from 'express';
import dotenv from 'dotenv';
import generateSocialPost, { generateBookSuggestions } from './generateContent.js';

dotenv.config();

const app = express();
const port =process.env.PORT || 8080

// Middleware to parse JSON body
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/generate-post', async (req, res) => {
  const { title, author } = req.body;


  if (!title || !author) {
    return res.status(400).json({ error: 'Both platform and topic are required.' });
  }

  try {
    const result = await generateBookSuggestions(title, author);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate post.' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
