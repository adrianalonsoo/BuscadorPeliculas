document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');
    //No se utiliza el boton por que esta el scroll infinito
    const loadMoreButton = document.getElementById('loadMoreButton');
    const movieDetail = document.getElementById('movieDetail');
    const backButton = document.getElementById('volverBoton');
    const searchRespuesta = document.getElementById('search-results');

    let currentPage = 1;
    let currentSearch = '';

    //Evento para buscar las peliculas
    searchInput.addEventListener('input', function(event){
        const Q = event.target.value;
        if(Q.length >= 3){
            movieDetail.classList.add('d-none');
            currentSearch = searchInput.value;
            currentPage = 1;
            resultsContainer.innerHTML = '';
            fetchMovies(currentSearch, currentPage);
        }
    })
    
    //Evento para la barra de busqueda
    searchButton.addEventListener('click', function() {
        movieDetail.classList.add('d-none');
        currentSearch = searchInput.value;
        currentPage = 1;
        resultsContainer.innerHTML = '';
        fetchMovies(currentSearch, currentPage);
    });

   /* loadMoreButton.addEventListener('click', function() {
        currentPage++;
        fetchMovies(currentSearch, currentPage);
    }); */

    window.addEventListener('scroll', ()=> {
        if(!movieDetail.classList.contains('d-none')){
            return;
        }
        
        if((window.innerHeight + window.scrollY) >= document.body.offsetHeight){
            currentPage++;
            fetchMovies(currentSearch, currentPage);  
        } 
    });

    /*
    window.addEventListener('scroll',scrollinfinito);

    function scrollinfinito(){

        let scrollHeight=document.documentElement.scrollHeight;
        let scrollTop=document.documentElement.scrollTop;
        let clientHeight=document.documentElement.clientHeight;

        if((scrollTop+clientHeight) > (scrollHeight-10))
            fetchMovies(currentSearch, currentPage++)
    }
    */

    //Evento para volver a la pantalla principal
    backButton.addEventListener('click', function() {
        backButton.classList.add('d-none');
        movieDetail.classList.add('d-none');
        document.getElementById('search-results').classList.remove('d-none');
    });

    //Funcion Buscar peliculas
    function fetchMovies(search, page) {
        const url = `https://www.omdbapi.com/?apikey=97ac23bc&s=${search}&page=${page}`;
        //Fetch para obtener la respuesta de la api
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.Response === "True") {
                    //Si la respuesta es true se muestra la funcion mostrar resultados
                    displayResults(data.Search);
                } else {
                    resultsContainer.innerHTML = `<p>No se encontraron películas.</p>`;
                }

            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    //Funcion para mostrar los resultados de las peliculas
    function displayResults(movies) {
        movies.forEach(movie => {
            //Clase del css
            searchRespuesta.classList.remove('d-none');
            const movieElement = document.createElement('div');
            movieElement.className = 'col-md-4 mb-3';
            movieElement.innerHTML = `
                <div class="card">
                    <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}" onerror="this.onerror=null; this.src='default-image.jpg';">
                    <div class="card-body">
                        <h5 class="card-title">${movie.Title}</h5>
                        <p class="card-text">${movie.Year}</p>
                        <button onclick="showMovieDetails('${movie.imdbID}')" class="btn btn-primary">Ver detalles</button>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(movieElement);
            
        });
    }
    //Funcion para mostrar los detalles de las peliculas
    window.showMovieDetails = function(imdbID) {
        const url = `https://www.omdbapi.com/?apikey=97ac23bc&i=${imdbID}`;
        //Fetch para obtener la respuesta de la api
        fetch(url)
            .then(response => response.json())
            .then(data => {
                var numero=data.Ratings.length;
                if(numero>1){
                    movieDetail.innerHTML = `
                    <h2>${data.Title}</h2>
                    <p><strong>Director:</strong> ${data.Director}</p>
                    <p><strong>Actores:</strong> ${data.Actors}</p>
                    <p><strong>Sinopsis:</strong> ${data.Plot}</p>
                    <p><strong>Ratings:</strong> ${data.Ratings[0].Source} ${data.Ratings[0].Value} <br>  
                    ${data.Ratings[1].Source} ${data.Ratings[1].Value}</p>
                    <img src="${data.Poster}" alt="${data.Title}" onerror="this.onerror=null; this.src='default-image.jpg';">
                `;
                }else if(numero>2){
                    movieDetail.innerHTML = `
                    <h2>${data.Title}</h2>
                    <p><strong>Director:</strong> ${data.Director}</p>
                    <p><strong>Actores:</strong> ${data.Actors}</p>
                    <p><strong>Sinopsis:</strong> ${data.Plot}</p>
                    <p><strong>Ratings:</strong> ${data.Ratings[0].Source} ${data.Ratings[0].Value} <br>  
                    ${data.Ratings[1].Source} ${data.Ratings[1].Value} ${data.Ratings[2].Source} ${data.Ratings[2].Value}</p>
                    <img src="${data.Poster}" alt="${data.Title}" onerror="this.onerror=null; this.src='default-image.jpg';">
                `;
                }
                else{
                    movieDetail.innerHTML = `
                    <h2>${data.Title}</h2>
                    <p><strong>Director:</strong> ${data.Director}</p>
                    <p><strong>Actores:</strong> ${data.Actors}</p>
                    <p><strong>Sinopsis:</strong> ${data.Plot}</p>
                    <p><strong>Ratings:</strong> ${data.Ratings[0].Source} ${data.Ratings[0].Value}</p>
                    <img src="${data.Poster}" alt="${data.Title}" onerror="this.onerror=null; this.src='default-image.jpg';">
                `;
                }
                backButton.classList.remove('d-none');
                movieDetail.classList.remove('d-none');
                document.getElementById('search-results').classList.add('d-none');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
});


