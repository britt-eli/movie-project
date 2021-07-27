"use strict"

const serverURL = 'https://tulip-cloudy-kettle.glitch.me/movies';

//CLICK EVENTS LIVE HERE

//MOVE SOMEWHERE ELSE. USED TO SAVE MOVIE TO DB (ADD A MOVIE BUTTON)
$("#save-button").click(function (e) {
    e.preventDefault();
    addMovie($("#new-movie").val(), $('#new-rating').val(), $('#new-plot').val(),
        $('#new-actors').val(), $('#new-director').val(), $('#new-year').val(), $('#new-genre').val());
    // getAllMovies()
    $('#addMovieModal').modal('hide');
});

//-----------------------EDIT CLICK EVENT ON MODAL CARD. INFORMATION FROM LAST EDITED MOVIE GETS OVERRIDDEN BY NEW INFO.------->
function addEditClickEvent() {
    $('.editButton').click(function (e) {
        e.preventDefault();
        const movieID = $(this).attr('data-id')
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
                id: movieID, title: editedTitle, rating: editedRating, plot: editedPlot,
                year: editedYear, actors: editedActors, director: editedDirector, genre: editedGenre
            };
            updateMovie(editedMovie).then(() => {
                $('#movieContainer').empty();
                $('#editMovieModal').modal('hide');
                getAllMovies();

            })
        })

    })
}

//-----------------------DELETE CLICK EVENT. NEED TO UPDATE SUBMIT WHEN ASKED ARE YOU SURE------------->
function addDeleteClickEvent() {
    $('.deleteButton').click(function (e) {
        e.preventDefault();
        $('#deleteMovieModal').modal('show');
        let deletedMovieID = $(this).attr('data-id'); //cannot use this inside => function
        console.log(deletedMovieID);
        //$('#confirm-delete-button').off();
        $('#confirm-delete-button').click(function () {
            deleteMovie(deletedMovieID).then(() => {
                $('#movieContainer').empty();
                $('#deleteMovieModal').modal('hide');
                getAllMovies();
            });

        });

    });
}

// $("#confirm-delete-button").click(function (e) {
//     e.preventDefault();
//     deleteMovie($("#new-movie").val(), $('#new-rating').val(), $('#new-plot').val(),
//         $('#new-actors').val(), $('#new-director').val(), $('#new-year').val(), $('#new-genre').val());
//     // getAllMovies()
//     $('#addMovieModal').modal('hide');
// });


//----------RENDER ALL MOVIES--------------->
const getAllMovies = () => fetch(serverURL).then(response => {
    response.json().then(movies => {
        var html = '';
        $('#loading').hide(3000);
        $("#addForm").show();
        $('#movieContainer').empty();

        movies.forEach(function (movie) {
            console.log(movie);
            html += `<div class="card" style="width: 18rem;">
            <div class="card-body">
    <h5 class="card-title">${movie.title}</h5>
    <h6 class="card-subtitle mb-2 text-muted">${movie.year}</h6>
    <p class="card-text">${movie.plot}</p>
    <p class="card-text">Actors: ${movie.actors}</p>
    <p class="card-text">Director: ${movie.director}</p>
    <p class="card-text">${movie.genre}</p>
    <p class="card-text">${movie.rating} Star(s)</p>
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

//CLICK EVENTS FOR EDIT AND DELETE ON CARDS/MODAL

// get single movie
const getAMovie = id => fetch(`${serverURL}/${id}`)
    .then(res => res.json())
    .catch(error => console.error(error));

//console.log to check if we can pull a single movie
// getAMovie(2).then(result => console.log(result));

//----------------ADD MOVIE TO DATABASE, CONNECTED WITH THE #SAVE-BUTTON------------->
const addMovie = (newMovie) => {
    const movie = {
        title: newMovie.title, rating: newMovie.rating, genre: newMovie.genre,
        actors: newMovie.actors, director: newMovie.director, year: newMovie.year
    };
    fetch(`${serverURL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie)
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