const L = require('leaflet');
const mapDiv = document.getElementById("stuntedMap");

// Map settings
let maxPlannedPathValue = -1;
let traveledPathDurationValue = -1;
let defaultZoomRangeValue = 18;

// Load map settings
if(localStorage.getItem("mapSettings")){
    let settings = JSON.parse(localStorage.getItem("mapSettings"));
    maxPlannedPathValue = settings.maxPlannedPath;
    traveledPathDurationValue = settings.traveledPathDuration;
    defaultZoomRangeValue = settings.defaultZoom;
}

// Map Initialization
const map = L.map('stuntedMap',{zoomControl: false, dragging: false, boxZoom: false, keyboard: false, scrollWheelZoom: false, touchZoom: false}).setView([42.66843276069138, -83.2178426227023], defaultZoomRangeValue);
// mapDiv.classList.remove("placeholder");
// mapDiv.classList.add("swiper-no-swiping");
// mapDiv.style.removeProperty("position");
const tileUrl = 'http://localhost:9154/styles/basic-preview/{z}/{x}/{y}.png'; // path to MBTiles file

let tilelayer = L.tileLayer(tileUrl, {minZoom: 1, maxZoom: 22}).addTo(map);
tilelayer.id = -1;

let markerLayer = L.layerGroup().addTo(map);
let currentPositionLayer = L.layerGroup().addTo(map);
let currentDestinationLayer = L.layerGroup().addTo(map);
let traveledPathLayer = L.layerGroup().addTo(map);
let plannedPathLayer = L.layerGroup().addTo(map);
let distanceToDestinationLayer = L.layerGroup().addTo(map);

const defaultIcon = new L.icon({
  iconUrl: './assets/img/MarkerIcons/red.png',
  shadowUrl: './assets/img/MarkerIcons/shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
  
});

const currentPositionIcon = new L.icon({
  iconUrl: './assets/img/MarkerIcons/blue.png',
  shadowUrl: './assets/img/MarkerIcons/shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Follow current position
let isDragging = false;
setInterval(() => {
    if(!isDragging && currentPosition.length > 0){
        map.setView(currentPosition, map.getZoom());
    }
}, 1000);

map.addEventListener("dragstart", function(event){
  isDragging = true;
});
map.addEventListener("dragend", function(event){
  isDragging = false;
});


// Load map elements from local storage

if(localStorage.getItem('currentDestinationLayer')){
    currentDestinationLayer = L.geoJSON(JSON.parse(localStorage.getItem('currentDestinationLayer')), {color: 'red'}).addTo(map);
}

const savedMarkers = JSON.parse(localStorage.getItem('markers'));
console.log(savedMarkers)
if(savedMarkers){
    savedMarkers.forEach(markerData => {
        if(markerData){
            const marker = L.marker([markerData.lat, markerData.lng], {icon: defaultIcon, draggable: false});
            markerLayer.addLayer(marker);
        }
    });
}

const { getInitialLLClient, navSatFix_listener } = require('./allDaRos.js');

// Initial position for planned paths
let initialPosition = [];
let initialPositionInterval = setInterval(function(){
  getInitialLLClient.callService(new ROSLIB.ServiceRequest(), function(result) {
    if(result.is_valid && result.latitude != 0 && result.longitude != 0){
      initialPosition = [result.latitude, result.longitude];
      console.log(`Initial Position: ${initialPosition[0]}, ${initialPosition[1]}`);
      map.setView(initialPosition, map.getZoom());
      clearInterval(initialPositionInterval);
    }
    else{
      console.log(result);
    }
  });
}, 1000);

// Current position marker
function mapCurrentPosition(latitude, longitude) {
    currentPositionLayer.clearLayers();
  
    let marker = L.marker([latitude, longitude], {icon: currentPositionIcon});
    currentPositionLayer.addLayer(marker);
}
  
let currentPosition = [];

navSatFix_listener.subscribe(function(message) {
  if(message.latitude && message.longitude){
    currentPosition = [message.latitude, message.longitude];
  }
});

setInterval(function(){
  if(currentPosition.length > 0){
    mapCurrentPosition(currentPosition[0], currentPosition[1]);
  }
}, 600);



const { plannedPath_listener } = require('./allDaRos');


const pathTraveledLine = L.polyline([], { color: 'blue' }).addTo(traveledPathLayer);


// Traveled Path Stuffs
const polylineData = localStorage.getItem('pathTraveledData');
if (polylineData) {
  const latLngs = JSON.parse(polylineData);
  pathTraveledLine.setLatLngs(latLngs);
}

let lastPosition = null;
setInterval(function() {
  if(currentPosition.length > 0){
    const latLng = L.latLng(currentPosition[0], currentPosition[1]);
  
    if (!lastPosition ||
        Math.abs(latLng.lat - lastPosition.lat) > 0.00001 ||
        Math.abs(latLng.lng - lastPosition.lng) > 0.00001) {

        pathTraveledLine.addLatLng(latLng);
        lastPosition = latLng;
        
        let pathTraveledLatLngs = pathTraveledLine.getLatLngs();
        let pathDuration = traveledPathDurationValue;
        if(traveledPathDurationValue >= 0 && pathTraveledLatLngs.length * 0.600 > pathDuration){
        while(pathTraveledLatLngs.length * 0.600 > pathDuration){
            // console.log("Removing point");
            pathTraveledLatLngs.shift();
        }
        pathTraveledLine.setLatLngs(pathTraveledLatLngs);
        }

        // Save polyline data to localStorage
        localStorage.setItem('pathTraveledData', JSON.stringify(pathTraveledLine.getLatLngs()));
    }
  }
}, 600);

// Planned Stuffs
let plannedPath = [];
let previousPlannedPath = [];

plannedPath_listener.subscribe(function (message) {
  plannedPath = message.poses;
});

let plannedPolyLines = [];
setInterval(function () {
  if (plannedPath.length > 0 && JSON.stringify(previousPlannedPath) !== JSON.stringify(plannedPath) && initialPosition.length > 0) {
    const filteredPlannedPath = plannedPath.filter((plan, index) => index % 5 === 0 && !previousPlannedPath.includes(plan));
    const plannedPolyLineCoords = [];

    // console.log(initialPosition);
    for (const pose of filteredPlannedPath) {
      let ll = doToLLTransform(pose.pose.position.x, pose.pose.position.y, pose.pose.position.z, initialPosition[0], initialPosition[1], 0);

      const latLng = {
        lat: ll.latitude,
        lng: ll.longitude
      };

      plannedPolyLineCoords.push(latLng);
    }
    
    const randomColor = getRandomColor();
    const plannedPolyLine = L.polyline(plannedPolyLineCoords, { color: randomColor }).addTo(plannedPathLayer);
    plannedPolyLines.push({plannedPolyLineCoords, randomColor});

    if(maxPlannedPathValue >= 0 && plannedPolyLines.length > maxPlannedPathValue){
      while(maxPlannedPathValue >= 0 && plannedPolyLines.length > maxPlannedPathValue){
        plannedPolyLines.shift();
      }
      map.removeLayer(plannedPathLayer);
      plannedPathLayer = L.layerGroup().addTo(map);
      plannedPolyLines.forEach((plannedPolyLine) => {
        L.polyline(plannedPolyLine.plannedPolyLineCoords, { color: plannedPolyLine.randomColor }).addTo(plannedPathLayer);
      });
    }

    localStorage.setItem('plannedPathData', JSON.stringify(plannedPolyLines));
    previousPlannedPath = plannedPath;
    // console.log(`Planned Polyline: ${plannedPolyLine.getLatLngs()}`);
  }
}, 200);

localStorage.getItem('plannedPathData') && JSON.parse(localStorage.getItem('plannedPathData')).forEach((plannedPolyLine) => {
  L.polyline(plannedPolyLine.plannedPolyLineCoords, { color: plannedPolyLine.randomColor }).addTo(plannedPathLayer);
});

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';

  // Define the RGB values for the preset CSS blue color
  const cssBlueR = 65;
  const cssBlueG = 105;
  const cssBlueB = 225;

  // Generate a new color and check if it is too similar to the preset CSS blue color
  do {
    // Generate a random color
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    // Extract the RGB values for the new color
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);

    // Calculate the difference between the new color and the preset CSS blue color
    const deltaR = Math.abs(r - cssBlueR);
    const deltaG = Math.abs(g - cssBlueG);
    const deltaB = Math.abs(b - cssBlueB);
    const delta = (deltaR + deltaG + deltaB) / 3;

    // If the difference is too small, generate a new color
    if (delta < 50) {
      color = '#';
    }
  } while (color === '#');

  return color;
}

