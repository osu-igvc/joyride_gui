const L = require('leaflet');
const ROSLIB = require('roslib');

const map = L.map('mapDiv').setView([36.11, -97.058], 13);
const tileUrl = 'http://localhost:9154/styles/basic-preview/{z}/{x}/{y}.png'; // path to your MBTiles file
let tilelayer = L.tileLayer(tileUrl, {minZoom: 1, maxZoom: 22}).addTo(map);
tilelayer.id = -1;
const defaultIcon = new L.icon({
  iconUrl: '../node_modules/leaflet/dist/images/marker-icon.png',
  iconAnchor: [2, 2],
  popupAnchor: [0, -2]
  
});

const currentPositionIcon = new L.icon({
  iconUrl: "./assets/img/gorillamunch.jpg",
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -2]
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

setInterval(function(){
  mapCurrentPosition(36.11, -97.058);
}, 1000);

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
    const markers = markerLayer.getLayers().filter(marker => !marker.options.icon.options.iconUrl.includes("gorilla")).map(marker => {
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

let heading = document.getElementById('heading').innerHTML.replace('°', '');
let headingRadians = heading * Math.PI / 180;
document.getElementById('setDestinationButton').onclick = function(){
  addMarker();
  console.log(heading);
  saveMarkers();
  // let mark = markerLayer.getLayers().map(marker => {
  //   return {
  //     lat: marker.getLatLng().lat,
  //     lng: marker.getLatLng().lng
  //   }
  // });
  heading = document.getElementById('heading').innerHTML.replace('°', '');
  headingRadians = heading * Math.PI / 180;
};

const { transformCoordsClient, transformedCoords_publisher } = require('./allDaRos');
function doLatLongTransform(){
  const markers = markerLayer.getLayers().filter(marker => !marker.options.icon.options.iconUrl.includes("gorilla")).map(marker => {
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

 document.getElementById("confirmButt").onclick = function(){
  doLatLongTransform();
};


// [lat 36, 6, 58.5000++, N], [lng 96, 59, 52.669 W]

// const myPolyline = L.polyline([], { color: 'red' }).addTo(map);
// let latDeg = 36.11625;
// let longDeg = -96.997964;
// setInterval(function(){
//   latDeg += 0.00005;
//   longDeg += (Math.random() * 0.00003) - 0.00001;
//   // longDeg += Math.random() * 0.000001;
//   const latLng = L.latLng(latDeg, longDeg);
//   myPolyline.addLatLng(latLng);
// }, 500);

