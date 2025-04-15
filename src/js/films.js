async function fetchPopularMovies() {
    try {
        const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR`);
        const data = await res.json();
        displayMovies(data.results);
    } catch (err) {
        console.error("Erreur lors de la récupération des films populaires :", err);
    }
}

function displayMovies(movies) {
    const grid = document.getElementById("film-grid");
    grid.innerHTML = "";
    const favoris = JSON.parse(localStorage.getItem("favoris")) || [];

    movies.forEach(movie => {
        const isFav = favoris.some(f => f.id === movie.id && f.type === "movie");

        const col = document.createElement("div");
        col.className = "col";

        col.innerHTML = `
            <div class="card h-100 position-relative">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <p class="card-text">${movie.overview ? movie.overview.substring(0, 120) + "..." : "Pas de description."}</p>
                </div>
                <button class="btn-fav ${isFav ? "liked" : ""}" onclick="toggleFavori(${movie.id}, 'movie', this)">
                    <i class="fa-${isFav ? "solid" : "regular"} fa-heart"></i>
                </button>
            </div>
        `;
        grid.appendChild(col);
    });
}

function toggleFavori(id, type, btn) {
    let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
    const index = favoris.findIndex(item => item.id === id && item.type === type);

    if (index > -1) {
        favoris.splice(index, 1);
        btn.classList.remove("liked");
        btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
    } else {
        favoris.push({ id, type });
        btn.classList.add("liked");
        btn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
    }

    localStorage.setItem("favoris", JSON.stringify(favoris));
}

document.addEventListener("DOMContentLoaded", fetchPopularMovies);
