'use strict';
const personalApi = 'at_XVDfZ8UdXvLnfJRhn1z2jSPc6kGzk';
// const apiUrl = 'https://www.ipify.org/';
const bypassCorsUrl = 'cors-anywhere.herokuapp.com';

const userIp = document.getElementById('ip-address');
const userLocation = document.getElementById('location');
const userTimezone = document.getElementById('timezone');
const userIsp = document.getElementById('isp');

const userInput = document.getElementById('search-input');
const searchBtn = document.querySelector('.search__button');

let myMap = '';

// Render User Info
function renderInfo(data) {
 userIp.innerHTML = `${data.ip}`;
 userLocation.innerHTML = `${data.location.city}, ${data.location.region}`;
 userTimezone.innerHTML = `${data.location.timezone}`;
 userIsp.innerHTML = `${data.isp}`;
}

function renderMap(data) {
 const lat = data.location.lat;
 const lng = data.location.lng;

 let container = L.DomUtil.get('mapid');
 if (container !== null) {
  myMap.remove();

  myMap = L.map('mapid').setView([lat, lng], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
   attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(myMap);
  L.marker([lat, lng])
   .addTo(myMap)
   .bindPopup('Here I am, which is here')
   .openPopup();
 }
}

// Set User Location
async function getIpData() {
 const ip = await fetch(`https://geo.ipify.org/api/v1?apiKey=${personalApi}`);
 const ipData = await ip.json();
 renderInfo(ipData);

 const lat = ipData.location.lat;
 const lng = ipData.location.lng;

 myMap = L.map('mapid').setView([lat, lng], 13);

 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
   '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
 }).addTo(myMap);

 L.marker([lat, lng])
  .addTo(myMap)
  .bindPopup('Here I am, which is here')
  .openPopup();
}

getIpData();

// User Search
async function search() {
 try {
  const ip = await fetch(
   `https://geo.ipify.org/api/v1?apiKey=${personalApi}&domain=${userInput.value}`
  );
  const ipData = await ip.json();
  renderMap(ipData);
  renderInfo(ipData);
 } catch (err) {
  console.log(`Oops ${err}`);
 }
}

// User Search
searchBtn.addEventListener('click', (e) => {
 e.preventDefault();
 search();
 console.log('Searched');
});
