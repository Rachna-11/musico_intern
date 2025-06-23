let angle = 0;
function rotateLoader() {
    angle += 5;
    document.getElementById('loader').style.transform = `rotate(${angle}deg)`;
    requestAnimationFrame(rotateLoader);
}

setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('mainContent').style.display = "block";
}, 2000);

function MovieSearch() {
    let movie = document.getElementById("MovieName").value;
    let movieContent = document.getElementById("content");

    movieContent.innerHTML = "";

    const apiKey = 'b48ae88cb7c32108bd9661aafd08d5b2';

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie}`)
        .then(r => r.json())
        .then(data => {
            if (data.results.length === 0) {
                movieContent.innerHTML = "<p>No movies found!</p>";
                return;
            }

            data.results.forEach(e => {
                let movieCard = document.createElement("div");
                let movieImg = document.createElement("img");
                let movieTitle = document.createElement("h3");
                let movieYear = document.createElement("p");
                let movieRating = document.createElement("p");
                let moviePlot = document.createElement("p");

                movieCard.classList.add("movieCard");
                movieImg.classList.add("movieImg");
                movieTitle.classList.add("movieTitle");
                movieYear.classList.add("movieYear");
                movieRating.classList.add("movieRating");
                moviePlot.classList.add("moviePlot");

                if (e.poster_path) {
                    movieImg.setAttribute("src", `https://image.tmdb.org/t/p/w500${e.poster_path}`);
                } else {
                    movieImg.setAttribute("src", "https://via.placeholder.com/300x400?text=No+Image");
                }

                movieTitle.textContent = e.title;
                movieYear.textContent = `Release Date: ${e.release_date || 'N/A'}`;
                movieRating.textContent = `Rating: ${e.vote_average || 'N/A'}`;
                moviePlot.textContent = `Overview: ${e.overview || 'No overview available.'}`;

                movieCard.appendChild(movieImg);
                movieCard.appendChild(movieTitle);
                movieCard.appendChild(movieYear);
                movieCard.appendChild(movieRating);
                movieCard.appendChild(moviePlot);
                movieContent.appendChild(movieCard);
            });
        })
        .catch(err => {
            console.error(err);
            movieContent.innerHTML = "<p>Error fetching data!</p>";
        });
}
