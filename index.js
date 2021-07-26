"use strict"

fetch('https://scarlet-honeysuckle-twister.glitch.me/movies').then(response => {
    response.json().then(movies =>{
        console.log(movies)
    });
});

const serverURL = 'https://scarlet-honeysuckle-twister.glitch.me/movies';

fetch(serverURL)
    .then(res => res.json())
    .then(data => console.log(data));


// const objToSend = {
//  user: "eli"
//     message: "really enjoyed movies project"
// };
//
// const options = {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(objToSend),
// };
// fetch(url, options)
//     .then( response => console.log(response) ) /* review was created successfully */
//     .catch( error => console.error(error) ); /* handle errors */


function AJAX(url, method = "GET", data) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
    return fetch(url, options)
        .then(res => res.json())
        .then(responseData => responseData)
        .catch(err => err)
}
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

//DELETE METHOD
AJAX(serverURL + "/5","DELETE")
    .then(data => console.log(data))

AJAX(serverURL)
    .then(data => console.log(data))



