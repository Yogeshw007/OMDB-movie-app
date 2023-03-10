if (!localStorage.getItem('favMoviesList')) {
    localStorage.setItem('favMoviesList', JSON.stringify(new Array()));
}

const searchSubmitButton = document.getElementById('search-submit');
const searchField = document.getElementById('search-bar');
const movieListDropdown = document.getElementById('movie-dropdown');
const movieContainer = document.getElementById('movie-container');
const homeBanner = document.querySelector('#home-content');

const apiKey = '921d0e95';
searchSubmitButton.addEventListener('click', renderSearchProducts);

searchField.addEventListener('keyup', handleSuggestionSearch);

document.querySelector('body').addEventListener('click', function (e) {
    if (e.target.className !== 'dropdown-menu') {
        movieListDropdown.classList.remove('show');
    }

});

// Function to get movie results response
async function getMovieResults(searchKeyword) {
    const currentYear = new Date().getFullYear();

    let response = await fetch(`https://www.omdbapi.com/?s=${searchKeyword}&y=${currentYear}&apikey=${apiKey}`);
    let data = await response.json();

    return data.Search;
}

// Function to handle suggesstion search
async function handleSuggestionSearch(e) {
    e.preventDefault();

    let searchText = e.target.value;
    let searchMoviesList = await getMovieResults(searchText);

    if (searchMoviesList) {
        movieListDropdown.classList.toggle('show');

        for (let item of searchMoviesList) {
            const movieItem = document.createElement('a');
            movieItem.className = 'dropdown-item';
            movieItem.href = `/OMDB-movie-app/movie.html?q=${item.Title}`;
            movieItem.textContent = item.Title;
            movieItem.target = '_blank';

            movieListDropdown.appendChild(movieItem);
        }
    }

}

// Function to check if movie is present in favorites list
function checkMovieIsPresentInFavoritesList(movie) {
    let favMoviesList = JSON.parse(localStorage.getItem('favMoviesList'));

    if (favMoviesList.length == 0) {
        return false;
    }

    let movies = favMoviesList.filter((favMovie) => favMovie.Title === movie)

    return movies.length > 0;
}

// Function to remove movies from favorites list
function removeMovieFromFavorite(movie) {
    let favMoviesList = JSON.parse(localStorage.getItem('favMoviesList'));
    let updatedMovieList = favMoviesList.filter((favMovie) => favMovie.Title !== movie);

    localStorage.setItem('favMoviesList', JSON.stringify(updatedMovieList));
}

// Function to render the searched products
async function renderSearchProducts(e) {
    e.preventDefault();

    if (searchField.value === '') {
        return;
    }

    let searchMoviesList = await getMovieResults(searchField.value);
    let searchInfoContainer = document.querySelector('#search-info');
    let searchInfo = document.createElement('h1');

    homeBanner.style.display = 'none';

    movieContainer.innerHTML = '';

    searchInfoContainer.innerHTML = ''
    searchInfoContainer.style.display = 'block';
    searchInfo.innerHTML = `Showing results for "${searchField.value}"`;
    searchInfoContainer.appendChild(searchInfo);

    searchMoviesList.forEach(movie => {
        let cardContainer = document.createElement('div');

        cardContainer.className = 'card position-relative mx-1';
        cardContainer.style.width = '17rem';
        cardContainer.style.marginBottom = '2rem';

        let currentMovieFavorite;

        currentMovieFavorite = checkMovieIsPresentInFavoritesList(movie.Title);

        let movieItemHTML;

        if (currentMovieFavorite) {
            movieItemHTML = `
                    <img src="${movie.Poster}" class="card-img-top" style="width:100%;height:300px;aspect-ratio:1;" alt="banner image">
                    <div class="card-body">
                        <a href="/OMDB-movie-app/movie.html?q=${movie.Title}" target="_blank">
                            <h5 class="card-title">${movie.Title}</h5>
                        </a>
                        
                    </div>
                    <div class="favorite-icon-container">
                        <i class="fa-solid fa-star fa-2xl fav-icon favorite-icon" data-name="${movie.Title}"></i>
                    </div>
                `;
        } else {
            movieItemHTML = `
                    <img src="${movie.Poster}" class="card-img-top" style="width:100%;height:300px;aspect-ratio:1;" alt="banner image">
                    <div class="card-body">
                        <a href="/OMDB-movie-app/movie.html?q=${movie.Title}" target="_blank">
                            <h5 class="card-title">${movie.Title}</h5>
                        </a>
                        
                    </div>
                    <div class="favorite-icon-container">
                        <i class="fa-solid fa-star fa-2xl fav-icon" data-name="${movie.Title}"></i>
                    </div>
                `;
        }

        cardContainer.innerHTML = movieItemHTML;

        movieContainer.appendChild(cardContainer);
    });
}

// Function to add listener to the favorites icon
function addListenerToFavoriteIcon() {

    document.body.addEventListener('click', function (e) {
        if (e.target.className.includes('fav-icon')) {

            let movieName = e.target.getAttribute('data-name');

            let moviePresentInFavorite = checkMovieIsPresentInFavoritesList(movieName);

            if (moviePresentInFavorite) {
                document.querySelector('i[data-name="' + movieName + '"]').style.color = 'black';
            } else {
                fetch(`https://www.omdbapi.com/?t=${movieName}&apikey=${apiKey}`)
                    .then(res => res.json())
                    .then((data) => {
                        let movieData = {
                            Poster: data.Poster,
                            Plot: data.Plot,
                            Title: data.Title
                        }

                        let updatedFavList = JSON.parse(localStorage.getItem('favMoviesList'));
                        updatedFavList.push(movieData);

                        document.querySelector('i[data-name="' + movieName + '"]').style.color = 'gold';

                        localStorage.setItem('favMoviesList', JSON.stringify(updatedFavList));
                    })
                    .catch((e) => console.log(e));
            }
        }
    });
}
addListenerToFavoriteIcon();