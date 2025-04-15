// Fonction pour récupérer les films populaires depuis l'API
async function fetchPopularMovies() {
    try {
        const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR`);
        const data = await res.json();
        displayMovies(data.results);
    } catch (err) {
        console.error("Erreur lors de la récupération des films populaires :", err);
    }
}

// Fonction pour afficher les films dans la grille
function displayMovies(movies) {
    const grid = document.getElementById("film-grid");
    grid.innerHTML = "";  // Vider la grille avant de la remplir

    const favoris = JSON.parse(localStorage.getItem("favoris")) || [];  // Récupérer les favoris stockés

    movies.forEach(movie => {
        const isFav = favoris.some(f => f.id === movie.id && f.type === "movie");  // Vérifier si le film est dans les favoris

        // Création de la carte de film avec un bouton cœur
        const col = document.createElement("div");
        col.className = "col";

        // HTML de la carte film
        col.innerHTML = `
            <div class="card h-100 position-relative">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <p class="card-text">${movie.overview ? movie.overview.substring(0, 120) + "..." : "Pas de description disponible."}</p>
                </div>
                <!-- Bouton cœur pour ajouter aux favoris -->
                <button class="btn-fav ${isFav ? "liked" : ""}" onclick="toggleFavori(${movie.id}, 'movie', this)">
                    <i class="fa-${isFav ? "solid" : "regular"} fa-heart"></i>
                </button>
            </div>
        `;
        grid.appendChild(col);  // Ajouter la carte à la grille
    });
}

// Fonction pour ajouter ou retirer un film des favoris
function toggleFavori(id, type, btn) {
    let favoris = JSON.parse(localStorage.getItem("favoris")) || [];  // Récupérer les favoris stockés
    const index = favoris.findIndex(item => item.id === id && item.type === type);  // Vérifier si le film est déjà dans les favoris

    if (index > -1) {
        favoris.splice(index, 1);  // Supprimer du tableau des favoris
        btn.classList.remove("liked");  // Enlever la classe "liked" du bouton
        btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;  // Cœur vide
    } else {
        favoris.push({ id, type });  // Ajouter le film aux favoris
        btn.classList.add("liked");  // Ajouter la classe "liked" au bouton
        btn.innerHTML = `<i class="fa-solid fa-heart"></i>`;  // Cœur rempli
    }

    // Sauvegarder les favoris dans le localStorage
    localStorage.setItem("favoris", JSON.stringify(favoris));
}

// Lancer la récupération des films populaires lorsque la page est chargée
document.addEventListener("DOMContentLoaded", fetchPopularMovies);
