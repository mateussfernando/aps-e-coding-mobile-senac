const fetch = require('node-fetch'); // Para buscar dados da URL
const cheerio = require('cheerio'); // Para manipular e buscar dados no HTML

const url = 'https://globoesporte.globo.com/pe/futebol/campeonato-pernambucano/';

async function fetchData() {
    try {
        // Faz a requisição da página
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        // Verifica os seletores específicos da página
        const tabelaStatus = $('.ranking-item-wrapper');
        const tabelaJogador = [];

        // Itera sobre os elementos da tabela
        tabelaStatus.each(function () {
            const nomeJogador = $(this).find('.jogador-nome').text().trim();
            const posicaoJogador = $(this).find('.jogador-posicao').text().trim();
            const numeroGols = $(this).find('.jogador-gols').text().trim();
            const timeJogador = $(this).find('.jogador-escudo > img').attr('alt')?.trim() || 'Time não identificado';

            // Checa se os dados foram coletados corretamente antes de adicionar
            if (nomeJogador && posicaoJogador && numeroGols && timeJogador) {
                tabelaJogador.push({
                    nomeJogador,
                    posicaoJogador,
                    numeroGols,
                    timeJogador,
                });
            }
        });

        // Exibe os dados no console
        console.log(tabelaJogador);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

// Executa a função
fetchData();
