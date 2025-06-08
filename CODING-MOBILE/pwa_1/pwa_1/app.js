document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'https://ghibliapi.vercel.app/films';
    let movies = []; // Armazena a lista de filmes para facilitar a busca

    // Faz uma requisição para a API do Studio Ghibli para obter a lista de filmes
    fetch(API_URL)
        .then(response => response.json())  // Converte a resposta para JSON
        .then(data => {
            console.log(data)
            movies = data; // Armazena os filmes na variável
            displayMovies(movies); // Exibe os filmes inicialmente
        })
        .catch(error => {
            console.error('Error fetching data:', error);  // Caso ocorra um erro na requisição, ele será exibido no console
        });

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase(); // Obtém o valor digitado e converte para minúsculo
        const filteredMovies = movies.filter(movie => 
            movie.title.toLowerCase().includes(query) // Filtra os filmes com base no título
        );
        displayMovies(filteredMovies); // Atualiza a lista exibida
    });

    function displayMovies(movies) {
        const moviesList = document.getElementById('movies-list');
        moviesList.innerHTML = ''; // Limpa a lista atual
        
        // Itera sobre cada filme filtrado
        movies.forEach(movie => {
            const listItem = document.createElement('li');  // Cria um item de lista para cada filme
            
            // Define o conteúdo HTML para cada filme, incluindo título, descrição, imagem e score
            listItem.innerHTML = `
                <img src="${movie.image}" alt="${movie.title}">
                <h2>${movie.title}</h2>
                <p>${movie.description}</p>
                <div class="score">Score: ${movie.rt_score}</div>
            `;
            
            // Adiciona o item de lista ao elemento `moviesList`
            moviesList.appendChild(listItem);
        });
    }
});
