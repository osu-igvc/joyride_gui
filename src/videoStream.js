// let vStream = document.getElementById("webcamThing");
// vStream.addEventListener("error", function(){
//   vStream.src="./assets/img/gorillamunch.jpg";
// })

// window.addEventListener("DOMContentLoaded", (event) =>{
//   vStream.src="http://0.0.0.0:8080/stream?topic=/sensors/cameras/lane/image_raw";
// });

// let gorilladID = setInterval(() => {
//     if(vStream.src.includes("gorillamunch.jpg")){
//       vStream.src="http://0.0.0.0:8080/stream?topic=/sensors/cameras/lane/image_raw";
//     }
//     else if(vStream.src == "http://0.0.0.0:8080/stream?topic=/sensors/cameras/lane/image_raw"){
//       vStream.removeAttribute("src");
//       clearInterval(gorilladID);
//       vStream.src="http://0.0.0.0:8080/stream?topic=/sensors/cameras/lane/image_raw"
//       vStream.style.display = "initial";
//     }
//   }, 1000);

let rawCameraStream = document.getElementById("rawCameraStream");
let laneTrackingStream = document.getElementById("laneTrackingStream");
let pedestrianDetectionStream = document.getElementById("pedestrianDetectionStream");

const { rawCameraStream_listener, laneTrackingStream_listener, pedestrianDetectionStream_listener } = require("./allDaRos.js");

rawCameraStream_listener.subscribe((message) => {
  rawCameraStream.src = "data:image/jpeg;base64," + message.data;
});

laneTrackingStream_listener.subscribe((message) => {
  laneTrackingStream.src = "data:image/jpeg;base64," + message.data;
});

pedestrianDetectionStream_listener.subscribe((message) => {
  pedestrianDetectionStream.src = "data:image/jpeg;base64," + message.data;
});



