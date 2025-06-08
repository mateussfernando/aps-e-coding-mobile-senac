const express = require('express');
const cors = require('cors');
const { scrapePage } = require('./scraper');
const { getContextualizedInfo } = require('./context');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/contextual-info', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ message: 'URL da página da Wikipédia é obrigatória' });
    }

    const scrapedInfo = await scrapePage(url);
    const contextualizedInfo = await getContextualizedInfo(scrapedInfo);
    
    res.json({ contextualizedInfo });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar contexto', error: error.message });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
