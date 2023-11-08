const global = {
  currentPage: window.location.pathname,
};

async function displayPopulerMovies() {
  const { results } = await fetchApiData("movie/popular");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            ${
              movie.poster_path
                ? `<img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}" />`
                : `<img
                src="./images/no-image.jpg"
                class="card-img-top"
                alt="${movie.title}" />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
    `;
    document.querySelector("#popular-movies").appendChild(div);
  });
}

async function displayPopulerTVShows() {
  const { results } = await fetchApiData("tv/popular");
  console.log(results);
  results.forEach((tvshow) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
            <a href="tv-details.html?id=${tvshow.id}">
              ${
                tvshow.poster_path
                  ? `<img
                  src="https://image.tmdb.org/t/p/w500${tvshow.poster_path}"
                  class="card-img-top"
                  alt="${tvshow.name}" />`
                  : `<img
                  src="./images/no-image.jpg"
                  class="card-img-top"
                  alt="${tvshow.name}" />`
              }
            </a>
            <div class="card-body">
              <h5 class="card-title">${tvshow.name}</h5>
              <p class="card-text">
                <small class="text-muted">Release: ${
                  tvshow.first_air_date
                }</small>
              </p>
            </div>
      `;
    document.querySelector("#popular-shows").appendChild(div);
  });
}

//Display Movie Details

async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];
  //   console.log(movieId);
  showSpinner();
  const movie = await fetchApiData(`movie/${movieId}`);
  hideSpinner();
  //Overlay for Background Image
  displayBackgroundImage("movie", movie.backdrop_path);
  const div = document.createElement("div");
  div.innerHTML = `
  <div class="details-top">
          <div>
          ${
            movie.poster_path
              ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}" />`
              : `<img
              src="./images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}" />`
          }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="${
              movie.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
              movie.budget
            )}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
              movie.revenue
            )}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <ul class="list-group">
            ${movie.production_companies
              .map((company) => `<li>${company.name}</li>`)
              .join("")}
          </ul>
        </div>
  `;
  document.querySelector("#movie-details").appendChild(div);
  console.log(movie);
}

async function displayShowDetails() {
  const showId = window.location.search.split("=")[1];
  //   console.log(movieId);
  showSpinner();
  const show = await fetchApiData(`tv/${showId}`);
  console.log(show);
  hideSpinner();
  //Overlay for Background Image
  displayBackgroundImage("tv", show.backdrop_path);
  const div = document.createElement("div");
  div.innerHTML = `
    <div class="details-top">
            <div>
            ${
              show.poster_path
                ? `<img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="${show.name}" />`
                : `<img
                src="./images/no-image.jpg"
                class="card-img-top"
                alt="${show.name}" />`
            }
            </div>
            <div>
              <h2>${show.name}</h2>
              <p>
                <i class="fas fa-star text-primary"></i>
                ${show.vote_average.toFixed(1)} / 10
              </p>
              <p class="text-muted">Release Date: ${show.first_air_date}</p>
              <p>
                ${show.overview}
              </p>
              <h5>Genres</h5>
              <ul class="list-group">
                ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
              </ul>
              <a href="${
                show.homepage
              }" target="_blank" class="btn">Visit Movie Homepage</a>
            </div>
          </div>
          <div class="details-bottom">
            <h2>Show Info</h2>
            <ul>
            <li><span class="text-secondary">Number of Episodes:</span> ${
              show.number_of_episodes
            }</li>
            <li><span class="text-secondary">Last Episode to Air:</span> ${
              show.last_air_date
            }</li>
            <li><span class="text-secondary">Status :</span> ${show.status}</li>
            </ul>
            <h4>Production Companies</h4>
            <ul class="list-group">
              ${show.production_companies
                .map((company) => `<li>${company.name}</li>`)
                .join("")}
            </ul>
          </div>
    `;
  document.querySelector("#show-details").appendChild(div);
}

function displayBackgroundImage(type, path) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${path})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";
  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}

//Fetch data from TMDB API
async function fetchApiData(endpoint) {
  const API_KEY = `dc380ff0f5124cfbd77b3d58f01b10bd`;
  const API_URL = "https://api.themoviedb.org/3";

  showSpinner();
  const response = await fetch(
    `${API_URL}/${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = response.json();
  hideSpinner();
  return data;
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

//Highlight Active Link
function highlightActiveLink() {
  document.querySelectorAll(".nav-link").forEach((navItem) => {
    if (navItem.getAttribute("href") === global.currentPage) {
      navItem.classList.add("active");
    }
  });
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Init App
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      console.log("Home");
      displayPopulerMovies();
      break;
    case "/shows.html":
      displayPopulerTVShows();
      console.log("Shows");
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayShowDetails();
      break;
    case "/search.html":
      console.log("Search");
      break;
    default:
      break;
  }
  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
