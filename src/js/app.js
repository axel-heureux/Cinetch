// src/js/app.js

async function fetchTopRatedMovies() {
    try {
      const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=fr-FR`);
      const data = await res.json();
      displayMovies(data.results);
    } catch (err) {
      console.error("Erreur lors de la récupération des films :", err);
    }
  }
  
  function displayMovies(movies) {
    const grid = document.getElementById("movie-grid");
    grid.innerHTML = "";

    movies.forEach(movie => {
        const col = document.createElement("div");
        col.className = "col";

        col.innerHTML = `
            <div class="card h-100">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <p class="card-text">${movie.overview ? movie.overview.substring(0, 120) + "..." : "Pas de description disponible."}</p>
                    <button class="btn btn-dark" onclick="redirectToDetail(${movie.id}, 'movie')">Voir les détails</button>
                </div>
            </div>
        `;

        grid.appendChild(col);
    });
}

function redirectToDetail(id, type) {
    window.location.href = `detail.html?id=${id}&type=${type}`;
}

// Fonction pour gérer l'entrée dans la barre de recherche
async function handleSearchInput() {
    const input = document.getElementById('search-input');
    const query = input.value.trim();
    const autocompleteList = document.getElementById('autocomplete-list');

    // Si la recherche est vide, on efface les suggestions
    if (!query) {
        autocompleteList.innerHTML = '';
        return;
    }

    try {
        // Requête à l'API pour rechercher des films
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`);
        const data = await res.json();

        // Efface les suggestions précédentes
        autocompleteList.innerHTML = '';

        // Vérifie si des résultats existent
        if (data.results && data.results.length > 0) {
            data.results.slice(0, 5).forEach(movie => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item list-group-item-action';
                listItem.textContent = movie.title || 'Titre non disponible';
                listItem.onclick = () => redirectToDetail(movie.id, 'movie');
                autocompleteList.appendChild(listItem);
            });
        } else {
            const noResultItem = document.createElement('li');
            noResultItem.className = 'list-group-item text-muted';
            noResultItem.textContent = 'Aucun résultat trouvé';
            autocompleteList.appendChild(noResultItem);
        }
    } catch (error) {
        console.error('Erreur lors de la recherche :', error);
    }
}
  
  document.addEventListener("DOMContentLoaded", fetchTopRatedMovies);
