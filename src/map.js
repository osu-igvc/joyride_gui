const L = require('leaflet');
const ROSLIB = require('roslib');
const mapDiv = document.getElementById("mapDiv");
// Map Settings
const maxPlannedPath = document.getElementById("maxPlannedPath");
let maxPlannedPathValue = -1;
const traveledPathDuration = document.getElementById("traveledPathDuration");
let traveledPathDurationValue = -1;

const markerRange = document.getElementById("maxMarkerRange");
let markerRangeValue = 1;


const defaultZoomRange = document.getElementById("defaultZoomRange");
let defaultZoomRangeValue = 18;

const mapOffCanvas = document.getElementById('mapOffCanvas');
const bsMap = new bootstrap.Offcanvas(mapOffCanvas)
let mapVisibility = false;
document.getElementById("mapSettings").addEventListener('click', function (e) {
    e.stopPropagation();
    bsMap.show();
});

// Prevent offcanvas triggering map stuffs
mapOffCanvas.addEventListener("click", function(e){
  e.stopPropagation();
});
mapOffCanvas.addEventListener("touchstart", function(e){
  e.stopPropagation();
});
mapOffCanvas.addEventListener("touchmove", function(e){
  e.stopPropagation();
});

defaultZoomRange.addEventListener("mousedown", function(e){
  e.stopPropagation();
});
defaultZoomRange.addEventListener("click", function(e){
  e.stopPropagation();
});
defaultZoomRange.addEventListener("touchstart", function(e){
  e.stopPropagation();
});
defaultZoomRange.addEventListener("touchmove", function(e){
  e.stopPropagation();
});

markerRange.addEventListener("mousedown", function(e){
  e.stopPropagation();
});
markerRange.addEventListener("click", function(e){
  e.stopPropagation();
});
markerRange.addEventListener("touchstart", function(e){
  e.stopPropagation();
});
markerRange.addEventListener("touchmove", function(e){
  e.stopPropagation();
});


// Save map settings
mapOffCanvas.addEventListener('hidden.bs.offcanvas', function () {
    // Save settings
    maxPlannedPathValue = maxPlannedPath.value;
    traveledPathDurationValue = traveledPathDuration.value;
    markerRangeValue = markerRange.value;
    defaultZoomRangeValue = defaultZoomRange.value;
    let settings = {
        maxPlannedPath: maxPlannedPathValue,
        traveledPathDuration: traveledPathDurationValue,
        maxMarkerRange: markerRangeValue,
        defaultZoom: defaultZoomRangeValue
    };
    localStorage.setItem("mapSettings", JSON.stringify(settings));
    mapVisibility = false;
});

mapOffCanvas.addEventListener('shown.bs.offcanvas', function () {
    mapVisibility = true;
});

// Load map settings
if(localStorage.getItem("mapSettings")){
    let settings = JSON.parse(localStorage.getItem("mapSettings"));
    maxPlannedPath.value = settings.maxPlannedPath;
    maxPlannedPathValue = settings.maxPlannedPath;
    traveledPathDuration.value = settings.traveledPathDuration;
    traveledPathDurationValue = settings.traveledPathDuration;
    markerRange.value = settings.maxMarkerRange;
    markerRangeValue = settings.maxMarkerRange;
    defaultZoomRange.value = settings.defaultZoom;
    defaultZoomRangeValue = settings.defaultZoom;
    document.getElementById("maxMarkerText").innerHTML = settings.maxMarkerRange;
    document.getElementById("defaultZoomText").innerHTML = settings.defaultZoom;
}

mapDiv.addEventListener("click", function(e){
    if(mapVisibility){
        bsMap.hide();
    }
});

mapDiv.addEventListener("touchstart", function(e){
    if(mapVisibility){
        bsMap.hide();
    }
});

document.getElementById("centerMapButt").addEventListener("click", function(event){
  event.stopPropagation();
  if(currentPosition.length > 0){
    map.setView(currentPosition, defaultZoomRangeValue);
  }
});


let follow = null;
let isDragging = false;
const followButt = document.getElementById("followButt");
followButt.addEventListener("click", function(event){
  event.stopPropagation();
  followButt.style.setProperty("--color1" ,followButt.style.getPropertyValue("--color1") == "var(--bs-success)" ? "var(--bs-white)" : "var(--bs-success)");
  if(!follow){
    follow = setInterval(() => {
      if(!isDragging){
        if(currentPosition.length > 0){
          map.setView(currentPosition, map.getZoom());
        }
      }
    }, 1000);
  } else {
    clearInterval(follow);
    follow = null;
  }
});

document.getElementById("clearLinesButt").addEventListener("click", function(event){
  event.stopPropagation();
  pathTraveledLine.setLatLngs([]);
  localStorage.setItem('pathTraveledData', JSON.stringify([]));
  plannedPathLayer.clearLayers();
  localStorage.setItem('plannedPathData', JSON.stringify([]));
});

document.getElementById("clearMarkerButt").addEventListener("click", function(event){
  event.stopPropagation();
  markerLayer.clearLayers();
});

// Map Settings End


const map = L.map('mapDiv',{zoomControl: false}).setView([36.11, -97.058], 18);
mapDiv.classList.remove("placeholder");
mapDiv.classList.add("swiper-no-swiping");
const tileUrl = 'http://localhost:9154/styles/basic-preview/{z}/{x}/{y}.png'; // path to your MBTiles file
let tilelayer = L.tileLayer(tileUrl, {minZoom: 1, maxZoom: 22}).addTo(map);
tilelayer.id = -1;
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

map.addEventListener("dragstart", function(event){
  isDragging = true;
});
map.addEventListener("dragend", function(event){
  isDragging = false;
});


let markerLayer = L.layerGroup().addTo(map);
let currentPositionLayer = L.layerGroup().addTo(map);
let traveledPathLayer = L.layerGroup().addTo(map);
let plannedPathLayer = L.layerGroup().addTo(map);
let distanceToDestinationLayer = L.layerGroup().addTo(map);

// Update map when settings are changed
maxPlannedPath.addEventListener("input", function(e){
  e.stopPropagation();
  maxPlannedPathValue = e.target.value;
});

traveledPathDuration.addEventListener("input", function(e){
  e.stopPropagation();
  traveledPathDurationValue = e.target.value;
});

defaultZoomRange.addEventListener("input", function(e){
  e.stopPropagation();
  document.getElementById("defaultZoomText").innerHTML = e.target.value;
  defaultZoomRangeValue = e.target.value;
  map.setZoom(e.target.value);
});

markerRange.addEventListener("input", function(e){
  e.stopPropagation();
  document.getElementById("maxMarkerText").innerHTML = e.target.value;
  markerRangeValue = e.target.value;
});

function mapCurrentPosition(latitude, longitude) {
  currentPositionLayer.clearLayers();

  let marker = L.marker([latitude, longitude], {icon: currentPositionIcon});
  marker.id = 0;
  currentPositionLayer.addLayer(marker);
}

let currentPosition = [];

let initialPosition = [];
const { getInitialLLClient } = require('./allDaRos.js');

let initialPositionInterval = setInterval(function(){
  getInitialLLClient.callService(new ROSLIB.ServiceRequest(), function(result) {
    if(result.is_valid && result.latitude != 0 && result.longitude != 0){
      initialPosition = [result.latitude, result.longitude];
      console.log(initialPosition[0], initialPosition[1]);
      map.setView(initialPosition, map.getZoom());
      clearInterval(initialPositionInterval);
    }
    else{
      console.log(result);
    }
  });
}, 1000);
// let firstPosition = true;

navSatFix_listener.subscribe(function(message) {
  if(message.latitude && message.longitude){
    currentPosition = [message.latitude, message.longitude];
    // if(firstPosition){
    //   initialPosition = [message.latitude, message.longitude];
    //   console.log(initialPosition[0], initialPosition[1]);
    //   map.setView(initialPosition, map.getZoom());
    //   firstPosition = false;
    // }
  }
});

setInterval(function(){
  if(currentPosition.length > 0){
    mapCurrentPosition(currentPosition[0], currentPosition[1]);
  }
}, 600);

function toDegreesMinutesSeconds(coordinate) {
  let direction = 0;
  if(coordinate < 0){
    direction = 1;
  }
  let absolute = Math.abs(coordinate);
  let degrees = Math.floor(absolute);
  let minutesNotTruncated = (absolute - degrees) * 60;
  let minutes = Math.floor(minutesNotTruncated);
  let seconds = (minutesNotTruncated - minutes) * 60;

  return [degrees, minutes, seconds, direction];
}

const savedMarkers = JSON.parse(localStorage.getItem('markers'));
console.log(savedMarkers)
if (savedMarkers) {
  savedMarkers.forEach(markerData => {
    if(markerData){
      const marker = L.marker([markerData.lat, markerData.lng], {icon: defaultIcon, draggable: true});
      markerLayer.addLayer(marker);
      let latDMS = toDegreesMinutesSeconds(markerData.lat);
      document.getElementById('latDegIn').value = latDMS[0];
      document.getElementById('latMinIn').value = latDMS[1];
      document.getElementById('latSecIn').value = latDMS[2];
      document.getElementById('latDirectIn').selectedIndex = latDMS[3];

      let longDMS = toDegreesMinutesSeconds(markerData.lng);
      document.getElementById('longDegIn').value = longDMS[0];
      document.getElementById('longMinIn').value = longDMS[1];
      document.getElementById('longSecIn').value = longDMS[2];
      document.getElementById('longDirectIn').selectedIndex = longDMS[3];
    }
  });
}
const savedHeading = JSON.parse(localStorage.getItem('heading'));
if (savedHeading) {
  console.log(savedHeading);
  document.getElementById('poleCenter').style.transform = `${savedHeading}`;
  document.getElementById('heading').innerHTML = `${JSON.parse(localStorage.getItem('headingNum'))}`;

}

function saveMarkers() {
  if(markerLayer.getLayers().length > 1){
    // Extract marker data from layer group
    const markers = markerLayer.getLayers().filter(marker => !marker.options.icon.options.iconUrl.includes("blue")).map(marker => {
        return {
          lat: marker.getLatLng().lat,
          lng: marker.getLatLng().lng
        }
    });
    // Save marker data to local storage
    localStorage.setItem('markers', JSON.stringify(markers));
    localStorage.setItem('heading', JSON.stringify(document.getElementById('poleCenter').style.transform));
    localStorage.setItem('headingNum', JSON.stringify(document.getElementById('heading').innerHTML));
  }
}

map.on('click', function(e) {
  while(markerLayer.getLayers().length > markerRangeValue){
    markerLayer.removeLayer(markerLayer.getLayers()[markerLayer.getLayers().length - 1]);
  }
  const marker = L.marker(e.latlng, {icon: defaultIcon, draggable: true});
  marker.addEventListener('drag', function(ev){
    const markerLatDMS = toDegreesMinutesSeconds(marker.getLatLng().lat);
    document.getElementById('latDegIn').value = markerLatDMS[0];
    document.getElementById('latMinIn').value = markerLatDMS[1];
    document.getElementById('latSecIn').value = markerLatDMS[2];
    document.getElementById('latDirectIn').selectedIndex = markerLatDMS[3];

    const markerLongDMS = toDegreesMinutesSeconds(marker.getLatLng().lng);
    document.getElementById('longDegIn').value = markerLongDMS[0];
    document.getElementById('longMinIn').value = markerLongDMS[1];
    document.getElementById('longSecIn').value = markerLongDMS[2];
    document.getElementById('longDirectIn').selectedIndex = markerLongDMS[3];
  });


  marker.addTo(markerLayer);
  

  let latDMS = toDegreesMinutesSeconds(e.latlng.lat);
  document.getElementById('latDegIn').value = latDMS[0];
  document.getElementById('latMinIn').value = latDMS[1];
  document.getElementById('latSecIn').value = latDMS[2];
  document.getElementById('latDirectIn').selectedIndex = latDMS[3];

  let longDMS = toDegreesMinutesSeconds(e.latlng.lng);
  document.getElementById('longDegIn').value = longDMS[0];
  document.getElementById('longMinIn').value = longDMS[1];
  document.getElementById('longSecIn').value = longDMS[2];
  document.getElementById('longDirectIn').selectedIndex = longDMS[3];

});

function addMarker(){
  let latDeg = Number(document.getElementById('latDegIn').value);
  let latMin = Number(document.getElementById('latMinIn').value);
  let latSec = Number(document.getElementById('latSecIn').value);
  let latDir = document.getElementById('latDirectIn').value;

  let longDeg = Number(document.getElementById('longDegIn').value);
  let longMin = Number(document.getElementById('longMinIn').value);
  let longSec = Number(document.getElementById('longSecIn').value);
  let longDir = document.getElementById('longDirectIn').value;

  let latDecDeg = latDeg + latMin/60 + latSec/(60*60);
  let longDecDeg = longDeg + longMin/60 + longSec/(60*60);
  if (latDir == "S") {
      latDecDeg = latDecDeg * -1;
  }
  if(longDir == "W"){
    longDecDeg = longDecDeg * -1;
  }

  while(markerLayer.getLayers().length > markerRangeValue){
    markerLayer.removeLayer(markerLayer.getLayers()[markerLayer.getLayers().length - 1]);
  }

  L.marker([latDecDeg, longDecDeg], {icon: defaultIcon, draggable: true}).addTo(markerLayer);
}

function getDistanceToMarker(lat1, lon1, lat2, lon2){
  const deg2rad = 3.14159/180.0;
  lat1 = lat1*deg2rad;
  lat2 = lat2*deg2rad;
  lon1 = lon1*deg2rad;
  lon2 = lon2*deg2rad;
  const R = 6371;
  const dLat = lat2-lat1;
  const dLon = lon2-lon1;
  let temp = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2) * Math.sin(dLon/2);
  temp = 2 * Math.atan2(Math.sqrt(temp), Math.sqrt(1-temp));

  return R * temp * 1609.34;
}

let heading = document.getElementById('heading').innerHTML.replace('°', '');
let headingRadians = heading * Math.PI / 180;
let straightLineDistance = null;
document.getElementById('setDestinationButton').addEventListener("click", function(){
  addMarker();
  console.log("heading: " + heading);
  saveMarkers();

  if(straightLineDistance){
    map.removeLayer(straightLineDistance);
  }
  
  heading = document.getElementById('heading').innerHTML.replace('°', '');
  headingRadians = heading * Math.PI / 180;
  straightLineDistanceToDestinations();
  // document.getElementById('distanceToDestination').innerHTML = getDistanceToMarker(currentPosition[0], currentPosition[1], currentDestination[0], currentDestination[1]).toFixed(2);
});

let currentDestinationLayer = L.layerGroup().addTo(map);
function straightLineDistanceToDestinations(){
  currentDestinationLayer.clearLayers();
  let first = true;
  markerLayer.getLayers().forEach(marker => {
    if(first){
      if(currentPosition.length > 0){
        L.polyline([currentPosition, marker.getLatLng()], { color: 'red' }).addTo(currentDestinationLayer);
      }
      first = false;
    }
    else{
      L.polyline([previousMarker.getLatLng(), marker.getLatLng()], { color: 'red' }).addTo(currentDestinationLayer);
    }
    previousMarker = marker;
  });
}

const { transformCoordsClient, transformedCoords_publisher, plannedPath_listener } = require('./allDaRos');

function doLatLongTransform(){
  const markers = markerLayer.getLayers().filter(marker => !marker.options.icon.options.iconUrl.includes("blue")).map(marker => {
    return {
      lat: marker.getLatLng().lat,
      lng: marker.getLatLng().lng
    }
  });
  console.log(`Marker Coords: ${markers[0].lat},  ${markers[0].lng}`)


  let request = new ROSLIB.ServiceRequest({
    ll_point: {
      latitude: markers[0].lat,
      longitude: markers[0].lng,
      altitude: 0
    }
  });

  transformCoordsClient.callService(request, function(result) {
    // Success callback
    console.log("FromLL Result: " + result);
  
    const transformedCoords = new ROSLIB.Message({
      header: {
        frame_id: 'map',
      },
      pose: {
        position: {
          x: result.map_point.x,
          y: result.map_point.y,
          z: 0
        },
        orientation: {
          x: 0,
          y: 0,
          z: Math.sin(headingRadians/2),
          w: Math.cos(headingRadians/2)
        }
      }
    });
    console.log(`Sent heading: ${headingRadians} radians, ${heading} degrees`);
    console.log(`FromLL x: ${transformedCoords.pose.position.x}, y: ${transformedCoords.pose.position.y} w: ${transformedCoords.pose.orientation.w}, z: ${transformedCoords.pose.orientation.z}`);
    transformedCoords_publisher.publish(transformedCoords);
    document.getElementById("setDestinationButton").innerHTML = "Set Destination";
  }, function(error) {
    // Error callback
    console.error('Error while calling the transformCoordsClient service:', error);
    document.getElementById("setDestinationButton").innerHTML = "Error calling service";
  });
}
const pathTraveledLine = L.polyline([], { color: 'blue' }).addTo(traveledPathLayer);

document.getElementById("confirmButt").onclick = function() {
  doLatLongTransform();
  // if (myPolyline.getLatLngs().length > 0) {
  //   myPolyline.setLatLngs([]);
  // }

  // // Clear polyline data from localStorage
  // localStorage.removeItem('polylineData');
};

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
          console.log("Removing point");
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
    const startTime = new Date().getTime();
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
    const endTime = new Date().getTime();
    console.log(`Time to process ${filteredPlannedPath.length} poses: ${endTime - startTime} ms`);
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


function doToLLTransform(x, y, z, refLat, refLon, refAlt) {
  const a = 6378137; // semi-major axis of the WGS84 ellipsoid (m)
  const f = 1 / 298.257223563; // flattening of the WGS84 ellipsoid
  const e2 = 2 * f - f ** 2; // square of eccentricity

  const lat0 = refLat * (Math.PI / 180); // reference latitude in radians
  const lon0 = refLon * (Math.PI / 180); // reference longitude in radians

  // Radius of curvature in the prime vertical
  const N0 = a / Math.sqrt(1 - e2 * Math.sin(lat0) ** 2);

  // Calculate the Cartesian coordinates of the reference point
  const x0 = (N0 + refAlt) * Math.cos(lat0) * Math.cos(lon0);
  const y0 = (N0 + refAlt) * Math.cos(lat0) * Math.sin(lon0);
  const z0 = (N0 * (1 - e2) + refAlt) * Math.sin(lat0);

  // Calculate the Cartesian coordinates of the input LTP point
  const x1 = x0 + x;
  const y1 = y0 + y;
  const z1 = z0 + z;

  // Convert the Cartesian coordinates to geodetic coordinates
  const p = Math.sqrt(x1 ** 2 + y1 ** 2);
  let lon = Math.atan2(y1, x1);
  let lat = Math.atan2(z1, p * (1 - e2));

  // Iterate to find the latitude
  let latOld;
  do {
    latOld = lat;
    const N = a / Math.sqrt(1 - e2 * Math.sin(latOld) ** 2);
    lat = Math.atan((z1 + e2 * N * Math.sin(latOld)) / p);
  } while (Math.abs(lat - latOld) > 1e-12);

  const N = a / Math.sqrt(1 - e2 * Math.sin(lat) ** 2);
  const alt = p / Math.cos(lat) - N;

  return {
    latitude: lat * (180 / Math.PI),
    longitude: lon * (180 / Math.PI),
    altitude: alt,
  };
}