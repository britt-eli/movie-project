"use strict";

const serverURL = 'https://tulip-cloudy-kettle.glitch.me/movies';
let localMovies;
//----------RENDER ALL MOVIES--------------->
const getAllMovies = () => fetch(serverURL).then(response => {
    response.json().then(movies => {
        var html = '';
        $('#loading').hide(3000);
        $("#addForm").show();
        $('#movieContainer').empty();
        localMovies = movies
        movies.forEach(function (movie) {
            console.log(movie);
            html += `<div class="card" style="width: 18rem; height: auto;">
            <div class="card-body">
            <img src="${movie.poster}" class="card-img-top" alt="...">
    <h3 class="card-title text-center">${movie.title}</h3>
    <h6 class="card-subtitle mb-2 text-muted text-center">${movie.year}</h6>
    <p class="card-text">${movie.plot}</p>
    <p class="card-text">Actors: ${movie.actors}</p>
    <p class="card-text">Director(s): ${movie.director}</p>
    <p class="card-text">Genre(s): ${movie.genre}</p>
    <p class="card-text">Star Rating: ${movie.rating}</p>
    <button type="submit" data-id=${movie.id}  class="btn-md btn-primary editButton">Edit Movie</button>
    <button type="button" data-id=${movie.id} class="btn-md btn-danger deleteButton" >Delete Movie</button>
 
  </div>
</div>`;
            $('#movieContainer').html(html)
        });
    }).then(() => {
        addEditClickEvent();
        addDeleteClickEvent();
    });
});
getAllMovies();

//-------------------ADD MOVIES FROM OMDB DATABASE----------------->

const getMoviesFromOMBDAPI = (movieToAdd) => {
    const OMDBAPI = `http://www.omdbapi.com/?apikey=${movieAPI}&t=${movieToAdd.title}`;
    fetch(OMDBAPI).then(response => {
        response.json().then(moviesFromOMDB => {
            // Object Properties for moviesFromOMDB: Title, Year, Genre, Director, Actors, Plot, Poster
            //HOW THIS WORKS: users only need to enter the movie title and OMDB will populate the rest if left empty
            //If a movie is a remake ex: Scarface 1932 vs Scarface 1983, user will need to enter the year

            movieToAdd.poster = moviesFromOMDB.Poster //movie poster will auto-populate from OMDB, no user input needed

            //If statements for fields left blank

            if (movieToAdd.plot === ""){
                movieToAdd.plot = moviesFromOMDB.Plot
            }
            if( movieToAdd.actors === ""){
                movieToAdd.actors = moviesFromOMDB.Actors
            }
            if (movieToAdd.director === ""){
              movieToAdd.director = moviesFromOMDB.Director
            }
            if (movieToAdd.genre === ""){
                movieToAdd.genre = moviesFromOMDB.Genre
            }
            if (movieToAdd.year === ""){
                movieToAdd.year = moviesFromOMDB.Year
            }

            addMovie(movieToAdd);

        });
    })
}


//----------USED TO SAVE MOVIE TO DB (ADD A MOVIE BUTTON) ***INFO FROM LAST ADDED MOVIE STILL THERE. BROWSER ISSUE?*** ------>
    $("#save-button").click(function (e) {
        e.preventDefault();
        const movieToAdd = {
            poster: $("#new-poster-url").val(),
            title: $("#new-movie").val(),
            rating: $('#new-rating').val(),
            genre: $('#new-genre').val(),
            actors: $('#new-actors').val(),
            director: $('#new-director').val(),
            year: $('#new-year').val(),
            plot: $('#new-plot').val()
        }
        getMoviesFromOMBDAPI(movieToAdd)
        // addMovie(movieToAdd)
        // getAllMovies()
        $('#addMovieModal').modal('hide');
    });

//-----------------------EDIT CLICK EVENT ON MODAL CARD. INFORMATION FROM LAST EDITED MOVIE GETS OVERRIDDEN BY NEW INFO (CORRECTED).------->
    function addEditClickEvent() {
        $('.editButton').click(function (e) {
            e.preventDefault();
            const movieID = $(this).attr('data-id')
            const originalMovie = localMovies.filter(movie => movieID == movie.id)[0]
            const moviePoster = originalMovie.poster
            $('#movie-edit').val(originalMovie.title);
            $('#rating-edit').val(originalMovie.rating);
            $('#plot-edit').val(originalMovie.plot);
            $('#year-edit').val(originalMovie.year);
            $('#actors-edit').val(originalMovie.actors);
            $('#genre-edit').val(originalMovie.genre);
            $('#director-edit').val(originalMovie.director)

            $('#editMovieModal').modal('show');
            $('#edit-submit-button').click(function () {
                let editedTitle = $('#movie-edit').val();
                let editedRating = $('#rating-edit').val();
                let editedPlot = $('#plot-edit').val();
                let editedYear = $('#year-edit').val();
                let editedActors = $('#actors-edit').val();
                let editedGenre = $('#genre-edit').val();
                let editedDirector = $('#director-edit').val()
                let editedMovie = { //create an edited new movie object
                    poster: moviePoster, id: movieID, title: editedTitle, rating: editedRating, plot: editedPlot,
                    year: editedYear, actors: editedActors, director: editedDirector, genre: editedGenre
                };
                updateMovie(editedMovie).then(() => {
                    $('#movieContainer').empty();
                    $('#editMovieModal').modal('hide');
                    getAllMovies();

                    $('#movie-edit').val('');
                    $('#rating-edit').val('');
                    $('#plot-edit').val('');
                    $('#year-edit').val('');
                    $('#actors-edit').val('');
                    $('#genre-edit').val('');
                    $('#director-edit').val('')
                })
            })

        })
    }

//-----------------------DELETE CLICK EVENT. NEED TO UPDATE SUBMIT WHEN ASKED ARE YOU SURE (FIXED)------------->
    function addDeleteClickEvent() {
        $('.deleteButton').click(function (e) {
            e.preventDefault();
            $('#deleteMovieModal').modal('show');
            let deletedMovieID = $(this).attr('data-id'); //cannot use this inside => function
            console.log(deletedMovieID);

            $('#confirm-delete-button').click(function () {
                deleteMovie(deletedMovieID).then(() => {
                    $('#movieContainer').empty();
                    $('#deleteMovieModal').modal('hide');
                    getAllMovies();
                });

            });

        });
    }

// get single movie
    const getAMovie = id => fetch(`${serverURL}/${id}`)
        .then(res => res.json())
        .catch(error => console.error(error));

//console.log to check if we can pull a single movie
// getAMovie(2).then(result => console.log(result));

//----------------ADD MOVIE TO DATABASE, CONNECTED WITH THE #SAVE-BUTTON------------->
    const addMovie = (newMovie) => {
        // newMovie.title

        fetch(`${serverURL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMovie)
        })
            .then(res => res.json())
            .then(data => {
                getAllMovies();
                console.log(`Success: created ${JSON.stringify(data)}`);
                return data.id;
            })
            .catch(console.error);
    }

//---------------------UPDATE MOVIE------------------------------------>
    const updateMovie = movie => fetch(`${serverURL}/${movie.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie)
    })
        .then(res => res.json())
        .then(data => {
            console.log(`Success: created ${JSON.stringify(data)}`);
            return data.id;
        })
        .catch(console.error);

//------------------DELETE MOVIE----------------------------------->
    const deleteMovie = id => fetch(`${serverURL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(() => {
            console.log(`Success: deleted ${id}`);
        })
        .catch(console.error);



// LECTURE NOTES

// fetch(serverURL)
//     .then(res => res.json())
//     .then(data => console.log(data));
//
//
// const objToSend = {
//  user: "eli",
//     message: "really enjoyed movies project"
// };
//

// fetch(url, options)
//     .then( response => console.log(response) ) /* review was created successfully */
//     .catch( error => console.error(error) ); /* handle errors */
//
//
// function AJAX(url, method = "GET", data) {
//     const options = {
//         method: method,
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     };
//     return fetch(url, options)
//         .then(res => res.json())
//         .then(responseData => responseData)
//         .catch(err => err)
// }
// AJAX(serverURL,{title: "we built our own ajax function"})
//     .then(function (data){
//         console.log(data)
//     })
//this is to fetch a single movie
//     AJAX(serverURL + "/3")
//         .then(data => console.log(data))


//PUT METHOD
// AJAX(serverURL +"/9","PUT"{
//     name: "Polaris",
//         message:"we are ready for the weekend!!"
// })
//
//         .then(data => console.log(data))

//PATCH METHOD
// AJAX(serverURL +"/9","Patch",data:{
//     message:"we are ready for the weekend!!"
// })
//
// .then(data => console.log(data))
//
//DELETE METHOD
// $.ajax(serverURL + "/3","DELETE")
//     .then(data => console.log(data))

// AJAX(serverURL)
//     .then(data => console.log(data))

//
