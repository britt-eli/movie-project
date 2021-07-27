"use strict"

const serverURL = 'https://tulip-cloudy-kettle.glitch.me/movies';
let localMovies = [];

//get all movies
const getAllMovies = () => fetch(serverURL).then(response => {
    response.json().then(movies => {
        localMovies = movies;
        var html = '';
        $('#loading').hide(3000);
        $("#addForm").show();
        $('#contain').empty();

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
    <button type="submit" data-id="${movie.id}" id="submit-edit-modal" class="btn btn-primary editButton">Edit Movie</button>
    <button type="button" class="btn btn-danger deleteButton" >Delete Movie</button>
     
    
  </div>
</div>`;
            $('#contain').html(html)
        });
    }).then(() => {
        addEditClickEvent();
        addDeleteClickEvent();
    });
});
getAllMovies();

function addEditClickEvent() {
    $('.editButton').click(function (){
     const movieID = $(this).attr('data-id')
        const movieToUpdate = localMovies.filter(function(movie) {
        if(movie.id == movieID) {
            return true;
        }else{
            return false;
        }
    }); $('#editMovieModal').modal('show');

        console.log(movieToUpdate);
    })
}
function addDeleteClickEvent() {
    $('.deleteButton').click(function (){
        const deletedMovieID = $(this).attr('data-id')
        const movieToDelete = localMovies.filter(function(movie) {
            if(movie.id == deletedMovieID) {
                return true;
            }else{
                return false;
            }
        }); $('#deleteMovieModal').modal('show');

        console.log(movieToDelete);
    })
}
// get single movie
const getAMovie = id => fetch(`${serverURL}/${id}`)
    .then(res => res.json())
    .catch(error => console.error(error));

//console.log to check if we can pull a single movie
// getAMovie(2).then(result => console.log(result));

//Add movie to database
const addMovie = (title, rating) => {
    const movie = {title: title, rating: rating}
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

$("#save-button").click (function (e){
    e.preventDefault();
    addMovie($("#new-movie").val(), $('#new-year').val(), $('#new-plot').val(), $('#new-actors').val(), $('#new-director').val(), $('#new-rating').val(), $('#new-genre').val());
    // getAllMovies()
    $('#addMovieModal').modal('hide');
});


//update movie request
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

//delete movie
const removeMovie = movie => fetch(`${serverURL}/${id}`, {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
    }
})
    .then(res => res.json())
    .then(() => {
        console.log(`Success: deleted ${title}`);
    })
    .catch(console.error);


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

