'use strict';
const personalApi = 'at_XVDfZ8UdXvLnfJRhn1z2jSPc6kGzk';
const userIp = document.getElementById('ip-address');
const userLocation = document.getElementById('location');
const userTimezone = document.getElementById('timezone');
const userIsp = document.getElementById('isp');

const overlay = document.querySelector('.overlay');
const errorContainer = document.getElementById('error');
const errorMessage = document.getElementById('error__message');
const closeErrorBtn = document.getElementById('close__error--btn');
let userInput = document.getElementById('search-input');
const searchBtn = document.querySelector('.search__button');

let myMap = '';
let myIcon = L.icon({
 iconUrl: 'images/icon-location.svg',
});

// Render User Info
function renderInfo(data) {
 userIp.innerHTML = `${data.ip}`;
 userLocation.innerHTML = `${data.location.city}, ${data.location.region}`;
 userTimezone.innerHTML = `${data.location.timezone}`;
 userIsp.innerHTML = `${data.isp}`;
}

function getMap(data) {
 const lat = data.location.lat;
 const lng = data.location.lng;

 myMap = L.map('mapid').setView([lat, lng], 13);
 L.tileLayer(
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicndpbnRlcjcxIiwiYSI6ImNrbjBoNnJ0ODBjbG0yb3BiaW54bzdobTUifQ.NTWRccBIgEerO4BIb96-AQ',
  {
   // attribution:
   //  'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
   maxZoom: 20,
   id: 'mapbox/streets-v11',
   tileSize: 512,
   zoomOffset: -1,
  }
 ).addTo(myMap);
 L.marker([lat, lng], { icon: myIcon }).addTo(myMap);
}

function renderMap(data) {
 const lat = data.location.lat;
 const lng = data.location.lng;

 let container = L.DomUtil.get('mapid');
 if (container !== null) {
  myMap.remove();

  myMap = L.map('mapid').setView([lat, lng], 13);
  L.tileLayer(
   'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicndpbnRlcjcxIiwiYSI6ImNrbjBoNnJ0ODBjbG0yb3BiaW54bzdobTUifQ.NTWRccBIgEerO4BIb96-AQ',
   {
    // attribution:
    //  'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
   }
  ).addTo(myMap);
  L.marker([lat, lng], { icon: myIcon }).addTo(myMap);
 }
}

// Set User Location
async function getIpData() {
 const ip = await fetch(`https://geo.ipify.org/api/v1?apiKey=${personalApi}`);
 const ipData = await ip.json();
 renderInfo(ipData);
 getMap(ipData);
 //  renderMap(ipData);
}

getIpData();

// User Search
async function search() {
 try {
  const ip = await fetch(
   `https://geo.ipify.org/api/v1?apiKey=${personalApi}&domain=${userInput.value}`
  );
  const ipData = await ip.json();
  renderInfo(ipData);
  // getMap(ipData);
  renderMap(ipData);
 } catch (err) {
  displayErrorMsg(err);
 }
}

function displayErrorMsg() {
 overlay.classList.add('fade-in');
 errorContainer.classList.add('fade-in');
 errorMessage.innerHTML = `Oops...Something went wrong. Please enter a valid IP address or domain`;
}

function removeErrorMsg() {
 overlay.classList.remove('fade-in');
 errorContainer.classList.remove('fade-in');
 userInput.value = '';
}

// User Search
searchBtn.addEventListener('click', (e) => {
 e.preventDefault();
 search();
});

closeErrorBtn.addEventListener('click', () => {
 removeErrorMsg();
});
