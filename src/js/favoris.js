document.addEventListener("DOMContentLoaded", () => {
    loadFavoris();
});

async function loadFavoris() {
    const favoris = JSON.parse(localStorage.getItem("favoris")) || [];
    console.log("Favoris chargés :", favoris);  // Vérification des favoris dans le console

    const grid = document.getElementById("favoris-grid");
    grid.innerHTML = ""; // Clear any existing content

    // Si il n'y a pas de favoris, rien n'est ajouté dans la grille, la page reste neutre
    if (favoris.length === 0) {
        return; // Rien n'est affiché
    }

    // Charger chaque film/serie depuis l'API
    for (const fav of favoris) {
        try {
            const res = await fetch(`${BASE_URL}/${fav.type}/${fav.id}?api_key=${API_KEY}&language=fr-FR`);
            const data = await res.json();
            console.log("Données film/serie :", data);  // Vérification des données film/serie

            // Vérifier si les données sont valides
            if (!data || (!data.title && !data.name)) {
                console.warn(`Favori ignoré : données invalides pour l'ID ${fav.id}`);
                continue; // Passer au favori suivant
            }

            const posterPath = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'path_to_default_image.jpg';
            const title = data.title || data.name || 'Titre non disponible';
            const overview = data.overview ? data.overview.substring(0, 120) + "..." : "Pas de description disponible.";

            // Créer la colonne pour le film/serie
            const col = document.createElement("div");
            col.className = "col";
            col.innerHTML = `
                <div class="card h-100 position-relative">
                    <img src="${posterPath}" class="card-img-top" alt="${title}">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${overview}</p>
                        <button class="btn btn-dark" onclick="redirectToDetail(${data.id}, '${fav.type}')">Voir les détails</button>
                    </div>
                    <button class="btn-fav liked" onclick="toggleFavori(${data.id}, '${fav.type}', this)">
                        <i class="fa-solid fa-heart text-danger"></i>
                    </button>
                </div>
            `;
            grid.appendChild(col);
        } catch (error) {
            console.error("Erreur lors du chargement d'un favori :", error);
        }
    }
}

function toggleFavori(id, type, btn) {
    let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
    const index = favoris.findIndex(item => item.id === id && item.type === type);

    if (index > -1) {
        favoris.splice(index, 1); // Supprimer du localStorage
        btn.classList.remove("liked"); // Enlever la classe "liked" du bouton
    } else {
        favoris.push({ id, type }); // Ajouter au localStorage
        btn.classList.add("liked"); // Ajouter la classe "liked" au bouton
    }

    // Sauvegarder dans le localStorage
    localStorage.setItem("favoris", JSON.stringify(favoris));

    // Recharger les favoris
    loadFavoris();
}

function redirectToDetail(id, type) {
    window.location.href = `detail.html?id=${id}&type=${type}`;
}
