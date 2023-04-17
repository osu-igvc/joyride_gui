const L = require('leaflet');
const ROSLIB = require('roslib');

const map = L.map('mapDiv').setView([36.11, -97.058], 15);
document.getElementById('mapDiv').classList.remove("placeholder");
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


document.getElementById("centerMapOnPosition").addEventListener("click", function(event){
  event.stopPropagation();
  map.setView(currentPosition, map.getZoom());
});


let follow = null;
let isDragging = false;
document.getElementById("followDiv").addEventListener("click", function(event){
  event.stopPropagation();
});

document.getElementById("followCheckBox").addEventListener("change", function(event){
  event.stopPropagation();
  if(!follow){
    follow = setInterval(() => {
      if(!isDragging){
        map.setView(currentPosition, map.getZoom());
      }
    }, 1000);
  } else {
    clearInterval(follow);
    follow = null;
  }
});


map.addEventListener("dragstart", function(event){
  isDragging = true;
});
map.addEventListener("dragend", function(event){
  isDragging = false;
});


let markerLayer = L.layerGroup().addTo(map);

function mapCurrentPosition(latitude, longitude) {
  map.eachLayer(function (layer) {
    if(layer.id == 0){
      markerLayer.removeLayer(layer);
    }
  });
  let marker = L.marker([latitude, longitude], {icon: currentPositionIcon});
  marker.id = 0;
  markerLayer.addLayer(marker);
}

function removeAllButStartingLayer(keepLayerId){
  map.eachLayer(function (layer) {
    if(!layer.id && layer.id != -1 && !keepLayerId.includes(layer.id)){
      markerLayer.removeLayer(layer);
    }
  });
}

let currentPosition = [];
let currentDestination;
let initialPosition = [];
let firstPosition = true;
navSatFix_listener.subscribe(function(message) {
  if(message.latitude && message.longitude){
    currentPosition = [message.latitude, message.longitude];
    if(firstPosition){
      initialPosition = [message.latitude, message.longitude];
      firstPosition = false;
    }
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
      currentDestination = [markerData.lat, markerData.lng];
      const marker = L.marker([markerData.lat, markerData.lng], {icon: defaultIcon});
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
  removeAllButStartingLayer([0]);
  L.marker(e.latlng, {icon: defaultIcon}).addTo(markerLayer);
  currentDestination = [e.latlng.lat, e.latlng.lng];

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
  removeAllButStartingLayer([0]);

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

  L.marker([latDecDeg, longDecDeg], {icon: defaultIcon}).addTo(markerLayer);
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
document.getElementById('setDestinationButton').onclick = function(){
  addMarker();
  console.log("heading: " + heading);
  saveMarkers();

  if(straightLineDistance){
    map.removeLayer(straightLineDistance);
  }

  straightLineDistance = L.polyline([currentPosition, currentDestination], { color: 'red' }).addTo(map);
  
  heading = document.getElementById('heading').innerHTML.replace('°', '');
  headingRadians = heading * Math.PI / 180;

  document.getElementById('distanceToDestination').innerHTML = getDistanceToMarker(currentPosition[0], currentPosition[1], currentDestination[0], currentDestination[1]).toFixed(2);
};

const { transformCoordsClient, transformedCoords_publisher, plannedPath_listener, transformToLLClient } = require('./allDaRos');
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
const myPolyline = L.polyline([], { color: 'blue' }).addTo(map);

document.getElementById("confirmButt").onclick = function() {
  doLatLongTransform();
  if (myPolyline.getLatLngs().length > 0) {
    myPolyline.setLatLngs([]);
  }

  // Clear polyline data from localStorage
  localStorage.removeItem('polylineData');
};

// Load polyline data from localStorage
const polylineData = localStorage.getItem('polylineData');
if (polylineData) {
  const latLngs = JSON.parse(polylineData);
  myPolyline.setLatLngs(latLngs);
}

let lastPosition = null;
setInterval(function() {
  if(currentPosition.length > 0){
    const latLng = L.latLng(currentPosition[0], currentPosition[1]);
  
    if (!lastPosition ||
        Math.abs(latLng.lat - lastPosition.lat) > 0.00001 ||
        Math.abs(latLng.lng - lastPosition.lng) > 0.00001) {
      myPolyline.addLatLng(latLng);
      lastPosition = latLng;

      // Save polyline data to localStorage
      localStorage.setItem('polylineData', JSON.stringify(myPolyline.getLatLngs()));
    }
  }
}, 600);

// function getRandomColor() {
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

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



// function doToLLTransform(x, y) {
//   return new Promise((resolve, reject) => {
//     let request = new ROSLIB.ServiceRequest({
//       map_point: {
//         x: x,
//         y: y,
//         z: 0
//       }
//     });

//     transformToLLClient.callService(request, function (result) {
//       resolve(result);
//     }, function (error) {
//       // Error callback
//       console.error('Error while calling the ToLL service:', error);
//       reject(error);
//     });
//   });
// }


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

let plannedPath = [];
let previousPlannedPath = [];

plannedPath_listener.subscribe(function (message) {
  plannedPath = message.poses;
});

setInterval(function () {
  if (plannedPath.length > 0 && JSON.stringify(previousPlannedPath) !== JSON.stringify(plannedPath)) {
    const filteredPlannedPath = plannedPath.filter((plan, index) => index % 5 === 0 && !previousPlannedPath.includes(plan));
    const plannedPolyLineCoords = [];
    const startTime = new Date().getTime();
    for (const pose of filteredPlannedPath) {
      let ll = doToLLTransform(pose.pose.position.x, pose.pose.position.y, pose.pose.position.z, initialPosition[0], initialPosition[1], 0);

      const latLng = {
        lat: ll.latitude,
        lng: ll.longitude
      };

      plannedPolyLineCoords.push(latLng);
    }
    const endTime = new Date().getTime();
    console.log(`Time to process ${filteredPlannedPath.length} poses: ${endTime - startTime} ms`);

    const randomColor = getRandomColor();
    const plannedPolyLine = L.polyline(plannedPolyLineCoords, { color: randomColor }).addTo(map);
    previousPlannedPath = plannedPath;
    console.log(`Planned Polyline: ${plannedPolyLine.getLatLngs()}`);
  }
}, 200);

// setInterval(async function () {
//   if (plannedPath.length > 0 && JSON.stringify(previousPlannedPath) !== JSON.stringify(plannedPath)) {
//     const filteredPlannedPath = plannedPath.filter((plan, index) => index % 25 === 0 && !previousPlannedPath.includes(plan));
//     const plannedPolyLineCoords = [];
//     const startTime = new Date().getTime();
//     for (const pose of filteredPlannedPath) {
//       let ll = await doToLLTransform(pose.pose.position.x, pose.pose.position.y);

//       const latLng = {
//         lat: ll.ll_point.latitude,
//         lng: ll.ll_point.longitude
//       };

//       plannedPolyLineCoords.push(latLng);
//     }
//     const endTime = new Date().getTime();
//     console.log(`Time to process ${filteredPlannedPath.length} poses: ${endTime - startTime} ms`);

//     const randomColor = getRandomColor();
//     const plannedPolyLine = L.polyline(plannedPolyLineCoords, { color: randomColor }).addTo(map);
//     previousPlannedPath = plannedPath;
//     console.log(`Planned Polyline: ${plannedPolyLine.getLatLngs()}`);
//   }
// }, 500);


