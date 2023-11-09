const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  API_KEY: `dc380ff0f5124cfbd77b3d58f01b10bd`,
  API_URL: "https://api.themoviedb.org/3",
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

async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");
  //   console.log(global);
  if (global.search.term !== "" && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchApiData();
    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;
    // console.log(results, total_pages, page);
    if (results.length === 0) {
      showAlert("No results found");
      return;
    }
    displaySearchResults(results);
    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please enter search term");
  }
}

function displaySearchResults(results) {
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";
  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
              <a href="${global.search.type}-details.html?id=${result.id}">
                ${
                  result.poster_path
                    ? `<img
                    src="https://image.tmdb.org/t/p/w500${result.poster_path}"
                    class="card-img-top"
                    alt="${
                      global.search.type === "movie"
                        ? result.title
                        : result.name
                    }" />`
                    : `<img
                    src="./images/no-image.jpg"
                    class="card-img-top"
                    alt="${
                      global.search.type === "movie"
                        ? result.title
                        : result.name
                    }" />`
                }
              </a>
              <div class="card-body">
                <h5 class="card-title">${
                  global.search.type === "movie" ? result.title : result.name
                }</h5>
                <p class="card-text">
                  <small class="text-muted">Release: ${
                    global.search.type === "movie"
                      ? result.release_date
                      : result.first_air_date
                  }</small>
                </p>
              </div>
        `;
    document.querySelector("#search-results-heading").innerHTML = `
                  <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
    `;
    document.querySelector("#search-results").appendChild(div);
  });
  displayPagination();
}

function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
    `;
  document.querySelector("#pagination").appendChild(div);

  //Disable prev button if first page
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }

  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }

  //Next Page

  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results, total_pages } = await searchApiData();
    displaySearchResults(results);
  });

  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results, total_pages } = await searchApiData();
    displaySearchResults(results);
  });
}

function showAlert(message, className = "alert-error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);
  setTimeout(() => {
    alertEl.remove();
  }, 2000);
}

async function displaySwipperMovies() {
  const { results } = await fetchApiData("movie/now_playing");
  //   console.log(results);
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
            <img src="https://image.tmdb.org/t/p/w500${
              movie.poster_path
            }" alt="${movie.title}" />
        </a>
        <h4 class="swiper-rating">
            <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
              1
            )} / 10
        </h4>
    `;
    document.querySelector(".swiper-wrapper").appendChild(div);
    initSwiper();
  });
}

function initSwiper() {
  new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteration: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
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
  showSpinner();
  const response = await fetch(
    `${global.API_URL}/${endpoint}?api_key=${global.API_KEY}&language=en-US`
  );
  const data = response.json();
  hideSpinner();
  return data;
}

async function searchApiData() {
  showSpinner();
  const response = await fetch(
    `${global.API_URL}/search/${global.search.type}?api_key=${global.API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
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
      displaySwipperMovies();
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
      //   console.log("Search");
      search();
      break;
    default:
      break;
  }
  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
