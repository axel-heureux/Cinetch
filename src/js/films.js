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
                    <button class="btn btn-dark" onclick="redirectToDetail(${movie.id}, 'movie')">Voir les détails</button>
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

// Fonction pour rediriger vers la page de détails
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

// Lancer la récupération des films populaires lorsque la page est chargée
document.addEventListener("DOMContentLoaded", fetchPopularMovies);
