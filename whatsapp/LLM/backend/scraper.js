const axios = require('axios');
const cheerio = require('cheerio');

async function scrapePage(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Seleciona o conteúdo principal da página
    const contentDiv = $('#mw-content-text .mw-parser-output');

    // Extrai os primeiros parágrafos de texto dentro do conteúdo principal
    let info = '';
    contentDiv.find('p').each((index, element) => {
      const paragraph = $(element).text().trim();
      if (paragraph) {
        info += paragraph + '\n';
        if (index >= 1) return false;
      }
    });

    console.log(info);
    return info;

  } catch (error) {
    console.error('Erro ao realizar scraping:', error);
  }
}

module.exports = { scrapePage };
