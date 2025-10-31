// Image switcher code

fetch("/nav.html")
    .then(res => res.text())
    .then(html => document.getElementById("nav-placeholder").innerHTML = html);

var myImage = document.querySelector('img');


// Personalized welcome message code

var myButton = document.querySelector('button');
var myHeading = document.querySelector('h1');

function setUserName(){
  var myName = prompt('Please enter your name.');
  localStorage.setItem('name', myName);
}

if(!localStorage.getItem('name')){
  setUserName();
} else {
  var storedName = localStorage.getItem('name');
}

myButton.onclick = function(){
  //setUserName();
}

const gentCoords = [51.0504, 3.7304];
const map = L.map('map').setView(gentCoords, 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);
L.marker(gentCoords).addTo(map)
  .bindPopup('<b>Tennis Dubbelspel Gent</b><br>Blaarmeersen, Gent')
  .openPopup();
