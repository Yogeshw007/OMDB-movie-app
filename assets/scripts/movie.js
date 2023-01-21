let movieJson;
let favIcon;
let favList = JSON.parse(localStorage.getItem('favMoviesList'));

if (!favList) {
    localStorage.setItem('favMoviesList', JSON.stringify(new Array()));
    favList = JSON.parse(localStorage.getItem('favMoviesList'));
}

document.body.onload = function () {
    const currentYear = new Date().getFullYear();
    const apiKey = '921d0e95';
    const movieContainer = document.getElementById('movie-container');
    let currentFavItem = false;

    let queries = new URLSearchParams(window.location.search)

    let movieName = queries.get('q');
    console.log(movieName)

    favList.forEach((movie) => {
        if (movieName === movie.Title) {
            currentFavItem = true;
        }
    });

    fetch(`https://www.omdbapi.com/?t=${movieName}}&y=${currentYear}&apikey=${apiKey}`)
        .then(res => res.json())
        .then(res => {
            movieJson = res;

            let movieData = {
                Poster: movieJson.Poster,
                Plot: movieJson.Plot,
                Title: movieJson.Title
            }

            const movieCard = document.createElement('div');
            movieCard.className = 'card d-flex text-center align-items-center justify-content-around mx-auto mb-5';
            movieCard.style = 'width:50vw';

            let cardMovie = `
                <img src="${movieJson.Poster}" class="card-img-top" alt="Banner image">
                <div class="card-body bg-dark text-white">
                    <h5 class="card-title"><b>Movie name</b> : ${movieJson.Title}</h5>
                    <p class="card-text"><b>Plot</b> : ${movieJson.Plot}</p>
                    <p class="card-text"><b>Genre</b> : ${movieJson.Genre}</p>
                </div>
                <i class="fa-solid fa-star fa-2xl fav-icon" id="favorite-icon"></i>
            `;

            movieCard.innerHTML = cardMovie;

            movieContainer.appendChild(movieCard);

            let favIcon = document.getElementById('favorite-icon');
            let addToFav = document.getElementById('added-to-fav');

            favList = JSON.parse(localStorage.getItem('favMoviesList'));

            if (currentFavItem) {
                favIcon.style.color = 'gold';
            }

            favIcon.addEventListener('click', function (e) {
                favList = JSON.parse(localStorage.getItem('favMoviesList'));

                if (currentFavItem) {
                    favIcon.style.color = 'black';

                    let updatedList = favList.filter((movieName) => {
                        return movieJson.Title != movieName;
                    });

                    console.log('else  updated list', updatedList);

                    localStorage.setItem('favMoviesList', JSON.stringify(updatedList));
                } else {
                    favIcon.style.color = 'gold';
                    addToFav.style.display = 'block';

                    let updatedList = [...favList];
                    updatedList.push(movieData);

                    console.log('if updated list', updatedList);

                    localStorage.setItem('favMoviesList', JSON.stringify(updatedList));

                    setTimeout(() => {
                        addToFav.style.display = 'none';
                    }, 2000);
                }
                currentFavItem = !currentFavItem;

                console.log(localStorage)
            });

        })
        .catch(err => console.log(err));
}