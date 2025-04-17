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

async function fetchReviews() {
    try {
        // Récupérer les avis depuis l'API (endpoint en lecture seule)
        const res = await fetch(`${BASE_URL}/${movieType}/${movieId}/reviews?api_key=${API_KEY}&language=fr-FR`);
        const data = await res.json();
        let apiReviews = data.results || [];

        // Charger les avis enregistrés en localStorage pour ce film
        const localReviewsJSON = localStorage.getItem(`reviews_${movieId}`);
        let localReviews = localReviewsJSON ? JSON.parse(localReviewsJSON) : [];
        
        // Combiner les avis de l'API et ceux du localStorage
        const combinedReviews = [...apiReviews, ...localReviews];

        displayReviews(combinedReviews);
    } catch (err) {
        console.error("Erreur lors de la récupération des avis :", err);
    }
}

function displayReviews(reviews) {
    const reviewsContainer = document.getElementById('reviews-list');
    reviewsContainer.innerHTML = '';
    if (!reviews || reviews.length === 0) {
        reviewsContainer.innerHTML = '<p class="text-white">Aucun avis pour le moment.</p>';
        return;
    }
    reviews.forEach(review => {
        const reviewDate = review.created_at ? new Date(review.created_at).toLocaleDateString('fr-FR') : 'Date inconnue';
        let ratingStars = '';
        if (review.rating) {
            const fullStars = parseInt(review.rating);
            const emptyStars = 5 - fullStars;
            for(let i = 0; i < fullStars; i++){
                ratingStars += `<span style="color: yellow;">★</span>`;
            }
            for(let i = 0; i < emptyStars; i++){
                ratingStars += `<span style="color: grey;">★</span>`;
            }
        }
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review bg-dark p-3 mb-2 rounded';
        reviewDiv.innerHTML = `
            <p class="text-white">
                <strong>${review.author || 'Anonyme'}</strong> - 
                <small>${reviewDate}</small>
                ${ratingStars ? `<br>${ratingStars}` : ''}
            </p>
            <p class="text-white">${review.content}</p>
        `;
        reviewsContainer.appendChild(reviewDiv);
    });
}

async function submitReview(event) {
    event.preventDefault();
    const author = document.getElementById('review-author').value.trim();
    const reviewText = document.getElementById('review-text').value.trim();
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    if (!author || !reviewText) {
        alert("Veuillez renseigner votre nom et saisir votre avis.");
        return;
    }
    if (!rating) {
        alert("Veuillez sélectionner une note.");
        return;
    }
    try {
        const newReview = {
            author: author,
            content: reviewText,
            created_at: new Date().toISOString(),
            rating: rating
        };

        const localReviewsKey = `reviews_${movieId}`;
        const existingReviews = localStorage.getItem(localReviewsKey);
        let localReviews = existingReviews ? JSON.parse(existingReviews) : [];

        localReviews.push(newReview);
        localStorage.setItem(localReviewsKey, JSON.stringify(localReviews));

        fetchReviews();
        document.getElementById('review-form').reset();
    } catch (err) {
        console.error("Erreur lors de l'enregistrement de l'avis :", err);
        alert("Une erreur est survenue lors de l'enregistrement de votre avis.");
    }
}

function redirectToDetail(id, type) {
    window.location.href = `detail.html?id=${id}&type=${type}`;
}

// Charger les détails et les avis au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    fetchMovieDetails();
    fetchReviews();
    document.getElementById('review-form').addEventListener('submit', submitReview);
});