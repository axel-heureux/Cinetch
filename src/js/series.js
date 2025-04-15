// Fonction pour récupérer les séries populaires depuis l'API
async function fetchPopularSeries() {
    try {
        const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=fr-FR`);
        const data = await res.json();
        displaySeries(data.results);
    } catch (err) {
        console.error("Erreur lors de la récupération des séries populaires :", err);
    }
}

// Fonction pour afficher les séries dans la grille
function displaySeries(series) {
    const grid = document.getElementById("series-grid");
    grid.innerHTML = "";  // Vider la grille avant de la remplir

    const favoris = JSON.parse(localStorage.getItem("favoris")) || [];  // Récupérer les favoris stockés

    series.forEach(serie => {
        const isFav = favoris.some(f => f.id === serie.id && f.type === "tv");  // Vérifier si la série est dans les favoris

        // Création de la carte de série avec un bouton cœur
        const col = document.createElement("div");
        col.className = "col";

        // HTML de la carte de série
        col.innerHTML = `
            <div class="card h-100 position-relative">
                <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top" alt="${serie.name}">
                <div class="card-body">
                    <h5 class="card-title">${serie.name}</h5>
                    <p class="card-text">${serie.overview ? serie.overview.substring(0, 120) + "..." : "Pas de description disponible."}</p>
                    <button class="btn btn-dark" onclick="redirectToDetail(${serie.id}, 'tv')">Voir les détails</button>
                </div>
                <!-- Bouton cœur pour ajouter aux favoris -->
                <button class="btn-fav ${isFav ? "liked" : ""}" onclick="toggleFavori(${serie.id}, 'tv', this)">
                    <i class="fa-${isFav ? "solid" : "regular"} fa-heart"></i>
                </button>
            </div>
        `;
        grid.appendChild(col);  // Ajouter la carte à la grille
    });
}

// Fonction pour ajouter ou retirer une série des favoris
function toggleFavori(id, type, btn) {
    let favoris = JSON.parse(localStorage.getItem("favoris")) || [];  // Récupérer les favoris stockés
    const index = favoris.findIndex(item => item.id === id && item.type === type);  // Vérifier si la série est déjà dans les favoris

    if (index > -1) {
        favoris.splice(index, 1);  // Supprimer du tableau des favoris
        btn.classList.remove("liked");  // Enlever la classe "liked" du bouton
        btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;  // Cœur vide
    } else {
        favoris.push({ id, type });  // Ajouter la série aux favoris
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

// Lancer la récupération des séries populaires lorsque la page est chargée
document.addEventListener("DOMContentLoaded", fetchPopularSeries);
