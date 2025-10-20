// Image switcher code

fetch("/nav.html")
    .then(res => res.text())
    .then(html => document.getElementById("nav-placeholder").innerHTML = html);

var myImage = document.querySelector('img');

myImage.onclick = function(){
	var mySrc = myImage.getAttribute('src');
	if(mySrc === 'images/firefox-icon.png') {
      myImage.setAttribute('src','images/firefox2.png');
	} else {
	  myImage.setAttribute('src','images/firefox-icon.png');
	}
}

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
  setUserName();
}
