const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/ask', async (req, res) => {
  const { question } = req.body;
  try {
    const geminiResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=YOUR_API_KEY',
      {
        contents: [{ parts: [{ text: question }] }]
      }
    );
    const answer = geminiResponse.data.candidates[0].content.parts[0].text;
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao chamar a API LLM', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
