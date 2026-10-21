const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory tasks collection
let tasks = [];

// Step 3: Backend route that accepts a task title and returns a generated description
app.post('/api/ai/generate-description', async (req, res) => {
  const { title, testInvalidKey } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required for AI generation' });
  }

  const effectiveKey = testInvalidKey ? 'invalid_key_testing_failure_path' : process.env.OPENAI_API_KEY;

  try {
    // Check if key is invalid / unconfigured to trigger failure path
    if (!effectiveKey || effectiveKey.startsWith('invalid_') || effectiveKey.includes('your_')) {
      throw new Error('Invalid or unconfigured OpenAI API key (HTTP 401 Unauthorized simulated)');
    }

    const client = new OpenAI({ apiKey: effectiveKey });
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: `Write a concise 1-sentence task description for: ${title}` }],
      max_tokens: 60
    });

    const description = completion.choices[0].message.content.trim();
    res.status(200).json({ description, fallback: false });
  } catch (err) {
    console.warn(`[AI ERROR CAUGHT] ${err.message}`);
    // Step 3 & 6: On API failure, catch error and return fallback response so app continues
    res.status(200).json({
      description: `Complete all requirements for "${title}" ensuring thorough testing and documentation.`,
      fallback: true,
      errorNotice: 'Third-party AI service unavailable. Safe fallback applied.'
    });
  }
});

// Tasks CRUD
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  const task = { id: tasks.length + 1, title, description, createdAt: new Date() };
  tasks.push(task);
  res.status(201).json(task);
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Practical 13 AI Integration API' });
});

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Practical 13: AI API Integration into Web App      `);
  console.log(` Server running on http://localhost:${PORT}         `);
  console.log(`====================================================`);
});

module.exports = { app, server };
