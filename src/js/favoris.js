document.addEventListener("DOMContentLoaded", () => {
    loadFavoris();
});

async function loadFavoris() {
    const favoris = JSON.parse(localStorage.getItem("favoris")) || [];
    const grid = document.getElementById("favoris-grid");
    grid.innerHTML = "";

    if (favoris.length === 0) {
        grid.innerHTML = `<div class="col text-center text-white"><p>Aucun favori pour le moment.</p></div>`;
        return;
    }

    for (const fav of favoris) {
        try {
            const res = await fetch(`${BASE_URL}/${fav.type}/${fav.id}?api_key=${API_KEY}&language=fr-FR`);
            const data = await res.json();

            const col = document.createElement("div");
            col.className = "col";
            col.innerHTML = `
                <div class="card h-100 position-relative">
                    <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" class="card-img-top" alt="${data.title || data.name}">
                    <div class="card-body">
                        <h5 class="card-title">${data.title || data.name}</h5>
                        <p class="card-text">${data.overview ? data.overview.substring(0, 120) + "..." : "Pas de description disponible."}</p>
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
        favoris.splice(index, 1);
        btn.classList.remove("liked");
    }

    localStorage.setItem("favoris", JSON.stringify(favoris));
    loadFavoris();
}
