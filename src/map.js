const L = require('leaflet');
const ROSLIB = require('roslib');

const map = L.map('mapDiv').setView([36.11, -97.058], 13);
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

let currentPosition = [36.11, -97.058];
let currentDestination;

navSatFix_listener.subscribe(function(message) {
  if(message.latitude && message.longitude){
    currentPosition = [message.latitude, message.longitude];
  }
});

setInterval(function(){
  mapCurrentPosition(currentPosition[0], currentPosition[1]);
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
  console.log(heading);
  saveMarkers();

  if(straightLineDistance){
    map.removeLayer(straightLineDistance);
  }

  straightLineDistance = L.polyline([currentPosition, currentDestination], { color: 'blue' }).addTo(map);
  
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
    console.log(result);

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
  transformedCoords_publisher.publish(transformedCoords);

});
}
const myPolyline = L.polyline([], { color: 'blue' }).addTo(map);

 document.getElementById("confirmButt").onclick = function(){
  doLatLongTransform();
  if(myPolyline.getLatLngs().length > 0){
    myPolyline.setLatLngs([]);
  }
};


// [lat 36, 6, 58.5000++, N], [lng 96, 59, 52.669 W]

let lastPosition = null;
setInterval(function() {
  const latLng = L.latLng(currentPosition[0], currentPosition[1]);

  if (!lastPosition ||
      Math.abs(latLng.lat - lastPosition.lat) > 0.00001 ||
      Math.abs(latLng.lng - lastPosition.lng) > 0.00001) {
    myPolyline.addLatLng(latLng);
    lastPosition = latLng;
  }
}, 600);

function doToLLTransform(x, y){
  let request = new ROSLIB.ServiceRequest({
    xyz_point: {
      x: x,
      y: y,
      z: 0
    }
  });

  transformToLLClient.callService(request, function(result) {
    return result;
  });
}

const plannedPolyLine = L.polyline([], { color: 'red' }).addTo(map);

let plannedPath = [];

plannedPath_listener.subscribe(function(message) {
  plannedPath = message.poses;
});

setInterval(function() {
  if(plannedPath.length > 0){
    plannedPolyLine.setLatLngs(plannedPath.map(pose => {
      let ll = doToLLTransform(pose.position.x, pose.position.y);
      return {
        lat: ll.latitude,
        lng: ll.longitude
      }
    }));
  }
}, 1000);
