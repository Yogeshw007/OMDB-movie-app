let movieContainer = document.querySelector('#movie-container');

function renderMovieList() {
    movieContainer.innerHTML = '';

    let favMoviesList = JSON.parse(localStorage.getItem('favMoviesList'));

    favMoviesList.forEach((movie) => {

        let cardContainer = document.createElement('div');
        cardContainer.className = 'card position-relative mx-1';
        cardContainer.style.width = '17rem';
        cardContainer.style.marginBottom = '2rem';

        let movieItemHTML = `
                    <img src="${movie.Poster}" class="card-img-top" style="width:100%;height:300px;aspect-ratio:1;" alt="banner image">
                    <div class="card-body">
                        <a href="/movie.html?q=${movie.Title}">
                            <h5 class="card-title">${movie.Title}</h5>
                            <p class="card-text text-center">${movie.Plot}</p>
                        </a>
                    </div>
                    <div class="favorite-icon-container">
                        <i class="fa-solid fa-star fa-2xl fav-icon favorite-icon" data-name="${movie.Title}"></i>
                    </div>
                `;

        cardContainer.innerHTML = movieItemHTML;
        movieContainer.appendChild(cardContainer);
    })
}

function addListenerToFavoriteIcon() {
    document.body.addEventListener('click', function (e) {
        if (e.target.className.includes('favorite-icon')) {
            favMoviesList = JSON.parse(localStorage.getItem('favMoviesList'));

            let unfavoritedMovie = e.target.getAttribute('data-name');

            updatedMoviesList = favMoviesList.filter((movie) => {
                return unfavoritedMovie !== movie.Title;
            })

            localStorage.setItem('favMoviesList', JSON.stringify(updatedMoviesList));

            renderMovieList();
        }
    });
}

renderMovieList();
addListenerToFavoriteIcon();