document.getElementById("navTime").innerHTML = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
document.getElementById("status").onclick = () => {window.location.href = "systemHealth.html"};
const { ros } = require("./allDaRos.js");

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

let leftBlinkerID = null;
let rightBlinkerID = null;
function blinkerOnOff(leftBlinker, rightBlinker){
  if(leftBlinker && !leftBlinkerID){
    leftBlinkerID = setInterval(function(){
        let leftBlinky = document.getElementById("leftBlinkerIcon");
        leftBlinky.style.setProperty("--color1",'var(--bs-success)');
        setTimeout(function(){
            leftBlinky.style.setProperty("--color1", 'var(--bs-secondary)');
        }, 500);
      }, 1000);
  }
  if(rightBlinker && !rightBlinkerID){
    rightBlinkerID = setInterval(function(){
      let rightBlinky = document.getElementById("rightBlinkerIcon");
      rightBlinky.style.setProperty("--color1", 'var(--bs-success)');
      setTimeout(function(){
          rightBlinky.style.setProperty("--color1", 'var(--bs-secondary)');
      }, 500);
    }, 1000);
  }
  if(!leftBlinker && leftBlinkerID){
    clearInterval(leftBlinkerID);
    leftBlinkerID = null;
  }
  if(!rightBlinker && rightBlinkerID){
    clearInterval(rightBlinkerID);
    rightBlinkerID = null;
  }
  if(!leftBlinker && !rightBlinker){
    clearInterval(leftBlinkerID);
    clearInterval(rightBlinkerID);
    leftBlinkerID = null;
    rightBlinkerID = null;
  }
}

function headHighLightBeamOnOff(timeForHead, timeForHigh){
  let headHighDiv = document.getElementById("headHighLightBeamIconDiv");
  let headHigh = document.getElementById("headHighLightBeamIcon");
  if(timeForHead){
    headHighDiv.style.setProperty("--color1", 'var(--bs-warning)');
    headHigh.src = "./assets/img/head.svg";
  }
  if(timeForHigh){
    headHighDiv.style.setProperty("--color1", 'var(--bs-blue)');
    headHigh.src = "./assets/img/high.svg";
  }
  if(!timeForHead && !timeForHigh){
    headHighDiv.style.setProperty("--color1", 'var(--bs-secondary)');
    headHigh.src = "./assets/img/head.svg";
  }
}
function seatbeltOnOff(isSeatbelt){
  document.getElementById("seatBeltIcon").style.setProperty("--color1", isSeatbelt ? 'var(--bs-green)' : 'var(--bs-red)');
}

function heatedSeatsOnOff(){
  document.getElementById("heatedSeatsIcon").style.setProperty("--color1", 'var(--bs-orange');
}

function wipersOnOff(isWipers){
  document.getElementById("wipiesIcon").style.setProperty("--color1", isWipers ? 'var(--bs-blue' : 'var(--bs-secondary)');
}

function updateGear(gear){
  if(gear != 3){
    document.getElementById("reverseGear").style.backgroundColor = gear == 2 ? 'var(--bs-success)' : 'var(--bs-secondary)';
    document.getElementById("neutralGear").style.backgroundColor = gear == 0 ? 'var(--bs-success)' : 'var(--bs-secondary)';
    document.getElementById("forwardGear").style.backgroundColor = gear == 1 ? 'var(--bs-success)' : 'var(--bs-secondary)';
  }
  else{
    document.getElementById("reverseGear").style.backgroundColor = 'var(--bs-secondary)';
    document.getElementById("neutralGear").style.backgroundColor = 'var(--bs-secondary)';
    document.getElementById("forwardGear").style.backgroundColor = 'var(--bs-secondary)';
  }
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
  headHighLightBeamOnOff(message.headlights_on, message.highbeams_on);
  seatbeltOnOff(message.driver_seatbelt_on);
  leftBlinker = message.left_turn_signal_on;
  rightBlinker = message.right_turn_signal_on;
  blinkerOnOff(leftBlinker, rightBlinker);
  wipersOnOff(message.wipers_on);
}

const {accessoriesGEMFeedback_listener, driveByWire_listener} = require("./allDaRos.js");

accessoriesGEMFeedback_listener.subscribe((message) => {
  updateAccessories(message);
  if(document.getElementById("reverseGear")){
    updateGear(message.gear_status);
  }
});

// Drive by wire stuffs
let allowAutonomy = false;

function eStopOnOff(isEStop){
  document.getElementById("eStopIcon").style.setProperty("--color1", isEStop ? 'var(--bs-danger)' : 'var(--bs-secondary)');
}

function pBrakeOnOff(isPBrake){
  document.getElementById("pBrakeIcon").style.setProperty("--color1", isPBrake ? 'var(--bs-danger)' : 'var(--bs-secondary)');
}

function driveByWireOnOff(isDriveByWire){
  allowAutonomy = isDriveByWire;
  document.getElementById("driveByWireIcon").style.setProperty("--color1", isDriveByWire ? 'var(--bs-success)' : 'var(--bs-danger)');
}

driveByWire_listener.subscribe((message) => {
  eStopOnOff(message.estop_active);
  pBrakeOnOff(message.parking_brake_active);
  driveByWireOnOff(message.enable_ready);

});
