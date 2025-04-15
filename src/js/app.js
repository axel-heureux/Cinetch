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
          </div>
        </div>
      `;
  
      grid.appendChild(col);
    });
  }
  
  document.addEventListener("DOMContentLoaded", fetchTopRatedMovies);
  