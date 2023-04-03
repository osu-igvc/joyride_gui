document.getElementById("navTime").innerHTML = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

const ROSLIB = require('roslib');
const ros = new ROSLIB.Ros({ url: "ws://localhost:9190" });

let connectRos = setInterval(function(){
    if(ros.isConnected){
      clearInterval(connectRos);
    }
    else{
      ros.connect("ws://localhost:9190");
    }
}, 1000);

ros.on("connection", () => {
  document.getElementById("rosBridgeIcon").style.setProperty("--color1", "var(--bs-success)");
});

ros.on("error", () => {
  document.getElementById("rosBridgeIcon").style.setProperty("--color1", "var(--bs-warning)");
});

ros.on("close", () => {
  document.getElementById("rosBridgeIcon").style.setProperty("--color1", "var(--bs-danger)");
  connectRos = setInterval(function(){
    if(ros.isConnected){
      clearInterval(connectRos);
    }
    else{
      ros.connect("ws://localhost:9190");
    }
  }, 1000);
});



let leftBlinker = false;
let rightBlinker = false;
setInterval(function(){
    if(leftBlinker){
        let leftBlinky = document.getElementById("leftBlinkerIcon");
        leftBlinky.style.setProperty("--color1",'var(--bs-success)');
        setTimeout(function(){
            leftBlinky.style.setProperty("--color1", 'var(--bs-secondary)');
        }, 500);
    }
    if(rightBlinker){
        let rightBlinky = document.getElementById("rightBlinkerIcon");
        rightBlinky.style.setProperty("--color1", 'var(--bs-success)');
        setTimeout(function(){
            rightBlinky.style.setProperty("--color1", 'var(--bs-secondary)');
        }, 500);
    }
}, 1000);

function headHightLightBeamOnOff(getHeadOrHigh){
  if(getHeadOrHigh == "head"){
    let head = document.getElementById("headHightLightBeamIcon");
    head.style.setProperty("--color1", 'var(--bs-warning)');
    head.src = "./assets/img/head.svg";
  }
  else if(getHeadOrHigh == "high"){
    let high = document.getElementById("headHightLightBeamIcon");
    high.style.setProperty("--color1", 'var(--bs-blue)');
    high.src = "./assets/img/high.svg";
  }
}
function seatbeltOnOff(isSeatbelt){
  document.getElementById("seatBeltIcon").style.setProperty("--color1", isSeatbelt ? 'var(--bs-green)' : 'var(--bs-red)');
}

function heatedSeatsOnOff(){
  document.getElementById("heatedSeatsIcon").style.setProperty("--color1", 'var(--bs-orange');
}

setInterval(function(){
  let currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  if(currentTime.includes("4:20")){
    document.getElementById("navTime").style.color = "var(--bs-green)";
    document.getElementById("navTime").innerHTML = "WEED NUMBER!!!!";
  }
  else{
    document.getElementById("navTime").style.color = "var(--bs-black)";
    document.getElementById("navTime").innerHTML = currentTime;
  }
  
}, 15000);


seatbeltOnOff(false);
heatedSeatsOnOff();

function updateAccessories(message){
  headHightLightBeamOnOff(message.headlights_on ? "head" : "high");
  seatbeltOnOff(message.driver_seatbelt_on);
  leftBlinker = message.left_turn_signal_on;
  rightBlinker = message.right_turn_signal_on;
}

const accessoriesGEMFeedback_listener = new ROSLIB.Topic({
  ros: ros,
  name: "/feedback/gem_accessories",
  messageType: "joyride_interfaces/msg/AccessoriesGEMFeedback"
});

accessoriesGEMFeedback_listener.subscribe((message) => {
  updateAccessories(message);

  if(document.getElementById("reverseGear")){
    updateGear(message.gear_status);
  }
});