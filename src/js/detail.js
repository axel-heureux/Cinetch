// Récupérer les paramètres de l'URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const movieType = urlParams.get('type'); // "movie" ou "tv"

async function fetchMovieDetails() {
    try {
        // Récupérer les détails du film/série
        const res = await fetch(`${BASE_URL}/${movieType}/${movieId}?api_key=${API_KEY}&language=fr-FR`);
        const data = await res.json();
        displayMovieDetails(data);

        // Récupérer les films/séries similaires
        const similarRes = await fetch(`${BASE_URL}/${movieType}/${movieId}/similar?api_key=${API_KEY}&language=fr-FR`);
        const similarData = await similarRes.json();
        displaySimilarMovies(similarData.results);
    } catch (err) {
        console.error("Erreur lors de la récupération des détails :", err);
    }
}

function displayMovieDetails(movie) {
    const detailsContainer = document.getElementById('movie-details');
    detailsContainer.innerHTML = `
        <div class="col-md-4">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="img-fluid" alt="${movie.title || movie.name}">
        </div>
        <div class="col-md-8 text-light">
            <h2">${movie.title || movie.name}</h2>
            <p><strong>Réalisateur :</strong> ${movie.created_by?.map(creator => creator.name).join(', ') || 'Non disponible'}</p>
            <p><strong>Genres :</strong> ${movie.genres.map(genre => genre.name).join(', ')}</p>
            <p><strong>Pays d'origine :</strong> ${movie.production_countries.map(country => country.name).join(', ')}</p>
            <p><strong>Résumé :</strong> ${movie.overview || 'Pas de résumé disponible.'}</p>
            <p><strong>Acteurs principaux :</strong> <span id="actors-list">Chargement...</span></p>
        </div>
    `;

    // Charger les acteurs
    fetchMovieCredits(movie.id);
}

async function fetchMovieCredits(movieId) {
    try {
        const res = await fetch(`${BASE_URL}/${movieType}/${movieId}/credits?api_key=${API_KEY}&language=fr-FR`);
        const data = await res.json();
        const actors = data.cast.slice(0, 5).map(actor => actor.name).join(', ');
        document.getElementById('actors-list').textContent = actors || 'Non disponible';
    } catch (err) {
        console.error("Erreur lors de la récupération des acteurs :", err);
    }
}

function displaySimilarMovies(movies) {
    const similarContainer = document.getElementById('similar-movies');
    similarContainer.innerHTML = '';

    movies.forEach(movie => {
        const col = document.createElement('div');
        col.className = 'col';

        col.innerHTML = `
            <div class="card h-100 bg-dark">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title || movie.name}">
                <div class="card-body">
                    <h5 class="card-title text-dark">${movie.title || movie.name}</h5>
                    <button class="btn btn-dark" onclick="redirectToDetail(${movie.id}, '${movieType}')">Voir les détails</button>
                </div>
            </div>
        `;

        similarContainer.appendChild(col);
    });
}

function redirectToDetail(id, type) {
    window.location.href = `detail.html?id=${id}&type=${type}`;
}

// Charger les détails au chargement de la page
document.addEventListener('DOMContentLoaded', fetchMovieDetails);