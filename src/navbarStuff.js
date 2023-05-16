document.getElementById("navTime").innerHTML = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
document.getElementById("status").style.removeProperty("background");
document.getElementById("status").style.setProperty("--color1", "var(--bs-success)");
const { ipcRenderer } = require('electron');

let alertContainer = document.createElement("div");
alertContainer.classList.add("alertContainer");
document.querySelector("nav").appendChild(alertContainer);

let alertDiv = document.createElement("div");
alertDiv.classList.add("alert", "alert-danger", "alert-dismissible", "show", "fade", "alertDiv", "blink_me");
alertDiv.setAttribute("role", "alert");

let button = document.createElement("button");
button.classList.add("btn-close");
button.setAttribute("type", "button");
button.addEventListener("click", function(){
  showAlert(false);
});
button.setAttribute("aria-label", "Close");
alertDiv.appendChild(button);
alertContainer.appendChild(alertDiv);

function showAlert(show, message="Someone did an oopsie!"){
  if(show){
    alertDiv.innerHTML = message;
    alertDiv.style.visibility = "visible";
  }
  else{
    alertDiv.style.visibility = "hidden";
  }
}

let nagasaki = false;
ipcRenderer.on("nuke-time", (event, time) => {
  if(!nagasaki && document.getElementById("systemShutdownLaunch")){
    nagasaki = true;
    document.getElementById("systemShutdownLaunch").disabled = true;
  }
  document.getElementById("status").style.setProperty("--color1", "var(--bs-danger)");
  document.getElementById("status").innerHTML = `Shutdown in: ${time}`;
});

// document.getElementById("status").onclick = () => {window.location.href = "systemHealth.html"};
const { ros, navSatFix_listener } = require("./allDaRos.js");
connectionStatus = "closed";
let connectRos = setInterval(function(){
  if(ros.isConnected){
    clearInterval(connectRos);
  }
  else{
    ros.connect("ws://localhost:9190");
  }
}, 1000);

ros.on("connection", () => {
  if(connectionStatus !== "connected"){
    document.getElementById("rosBridgeIcon").style.setProperty("--color1", "var(--bs-success)");
    document.getElementById("rosBridgeIcon").classList.add("bounce_me");
    setTimeout(function(){
      document.getElementById("rosBridgeIcon").classList.remove("bounce_me");
    }, 1000);
  }
  connectionStatus = "connected";
});

ros.on("error", () => {
  if(connectionStatus === "connected"){
    document.getElementById("rosBridgeIcon").style.setProperty("--color1", "var(--bs-warning)");
    document.getElementById("rosBridgeIcon").classList.add("bounce_me");
    setTimeout(function(){
      document.getElementById("rosBridgeIcon").classList.remove("bounce_me");
    }, 1000);
  }
  connectionStatus = "error";
});

ros.on("close", () => {
  if(connectionStatus === "connected"){
    document.getElementById("rosBridgeIcon").style.setProperty("--color1", "var(--bs-danger)");
    document.getElementById("rosBridgeIcon").classList.add("bounce_me");
    setTimeout(function(){
      document.getElementById("rosBridgeIcon").classList.remove("bounce_me");
    }, 1000);

    connectRos = setInterval(function(){
      if(ros.isConnected){
        clearInterval(connectRos);
      }
      else{
        ros.connect("ws://localhost:9190");
      }
    }, 1000);
  }
  connectionStatus = "closed";
});

const { diagnosticMessages_listener } = require("./allDaRos.js");
let diagnosticMessages = []; 
diagnosticMessages_listener.subscribe(function(message){
  diagnosticMessages = message.status.map((status) => {
    return {
      name: status.name.split("/")[2],
      level: status.level
    }
  });
  let status = "var(--bs-success)";
  let msg = "No Warnings";
  let level = 0;
  diagnosticMessages.forEach((status) => {
    if(status.level > level){
      level = status.level;
      msg = status.name;
    }
  });
  if(level === 0){
    status = "var(--bs-success)";
  }
  else if(level === 1){
    status = "var(--bs-warning)";
  }
  else if(level === 2){
    status = "var(--bs-danger)";
  }
  document.getElementById("status").style.setProperty("--color1", status);
  document.getElementById("status").innerHTML = msg;
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

function headHighLightBeamOnOff(head, high){
  let headHighDiv = document.getElementById("headHighLightBeamIconDiv");
  let headHigh = document.getElementById("headHighLightBeamIcon");
  if(head){
    headHighDiv.style.setProperty("--color1", 'var(--bs-warning)');
    headHigh.src = "./assets/img/head.svg";
  }
  if(high){
    headHighDiv.style.setProperty("--color1", 'var(--bs-blue)');
    headHigh.src = "./assets/img/high.svg";
  }
  if(!head && !high){
    headHighDiv.style.setProperty("--color1", 'var(--bs-secondary)');
    headHigh.src = "./assets/img/head.svg";
  }
}
let seatbelt = "disconnected";
function seatbeltOnOff(isSeatbelt){
  if(seatbelt != "connected" && isSeatbelt){
    document.getElementById("seatBeltIcon").style.setProperty("--color1", 'var(--bs-green)');
    document.getElementById("seatBeltIcon").classList.add("bounce_me");
    setTimeout(function(){
      document.getElementById("seatBeltIcon").classList.remove("bounce_me");
    }, 1000);
    seatbelt = "connected";
  }
  if(seatbelt != "disconnected" && !isSeatbelt){
    document.getElementById("seatBeltIcon").style.setProperty("--color1", 'var(--bs-red)');
    document.getElementById("seatBeltIcon").classList.add("bounce_me");
    setTimeout(function(){
      document.getElementById("seatBeltIcon").classList.remove("bounce_me");
    }, 1000);
    seatbelt = "disconnected";
  }
}

function heatedSeatsOnOff(){
  document.getElementById("heatedSeatsIcon").style.setProperty("--color1", 'var(--bs-orange');
  document.getElementById("heatedSeatsIcon").classList.add("bounce_me");
  setTimeout(function(){
    document.getElementById("heatedSeatsIcon").classList.remove("bounce_me");
  }, 1000);
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
 

document.getElementById("seatBeltIcon").style.setProperty("--color1", 'var(--bs-red');
document.getElementById("heatedSeatsIcon").style.setProperty("--color1", 'var(--bs-orange');

function updateAccessories(message){
  headHighLightBeamOnOff(message.headlights_on, message.highbeams_on);
  seatbeltOnOff(message.driver_seatbelt_on);
  let leftBlinker = message.left_turn_signal_on;
  let rightBlinker = message.right_turn_signal_on;
  blinkerOnOff(leftBlinker, rightBlinker);
  wipersOnOff(message.wipers_on);
}

const {accessoriesGEMFeedback_listener, driveByWire_listener, gps_listener} = require("./allDaRos.js");

accessoriesGEMFeedback_listener.subscribe((message) => {
  updateAccessories(message);
  if(document.getElementById("reverseGear")){
    updateGear(message.gear_status);
  }
});

// Drive by wire stuffs
let allowAutonomy = false;

function eStopOnOff(isEStop){
  showAlert(isEStop, "E-Stop Pressed");
  document.getElementById("eStopIcon").style.setProperty("--color1", isEStop ? 'var(--bs-danger)' : 'var(--bs-secondary)');
  document.getElementById("eStopIcon").classList.add("bounce_me");
  setTimeout(function(){
    document.getElementById("eStopIcon").classList.remove("bounce_me");
  }, 1000);
}

function pBrakeOnOff(isPBrake){
  document.getElementById("pBrakeIcon").style.setProperty("--color1", isPBrake ? 'var(--bs-danger)' : 'var(--bs-secondary)');
  document.getElementById("pBrakeIcon").classList.add("bounce_me");
  setTimeout(function(){
    document.getElementById("pBrakeIcon").classList.remove("bounce_me");
  }, 1000);
}

function driveByWireOnOff(isDriveByWire){
  allowAutonomy = isDriveByWire;
  document.getElementById("driveByWireIcon").style.setProperty("--color1", isDriveByWire ? 'var(--bs-success)' : 'var(--bs-danger)');
  document.getElementById("driveByWireIcon").classList.add("bounce_me");
  setTimeout(function(){
    document.getElementById("driveByWireIcon").classList.remove("bounce_me");
  }, 1000);
}

previousEStop = false;
previousPBrake = false;
previousDriveByWire = false;
driveByWire_listener.subscribe((message) => {
  if(previousEStop != message.estop_active){
    eStopOnOff(message.estop_active);
    previousEStop = message.estop_active;
  }

  if(previousPBrake != message.parking_brake_active){
    pBrakeOnOff(message.parking_brake_active);
    previousPBrake = message.parking_brake_active;
  }

  if(previousDriveByWire != message.enable_ready){
    driveByWireOnOff(message.enable_ready);
    previousDriveByWire = message.enable_ready;
  }
});

gps_listener.subscribe((message) => {
  document.getElementById("gpsIcon_marker").fill = message.fix >= 3 ? 'var(--bs-black)' : '#00FFFFFF';
  document.getElementById("gpsIcon_bar1").fill = message.numsats >= 1 ? 'var(--bs-black)' : '#00FFFFFF';
  document.getElementById("gpsIcon_bar2").fill = message.numsats >= 2 ? 'var(--bs-black)' : '#00FFFFFF';
  document.getElementById("gpsIcon_bar3").fill = message.numsats >= 3 ? 'var(--bs-black)' : '#00FFFFFF';
  document.getElementById("gpsIcon_bar4").fill = message.numsats >= 4 ? 'var(--bs-black)' : '#00FFFFFF';

  let gpsIcon = document.getElementById("gpsIcon");
  if(message.numsats <= 1 || message.fix < 3){
    gpsIcon.style.setProperty("--color1", 'var(--bs-danger)');
    gpsIcon.classList.add("bounce_me");
    setTimeout(function(){
      gpsIcon.classList.remove("bounce_me");
    }, 1000);
  }
  else if(message.numsats >= 2 && message.numsats <= 3 && message.fix >= 3){
    gpsIcon.style.setProperty("--color1", 'var(--bs-warning)');
    gpsIcon.classList.add("bounce_me");
    setTimeout(function(){
      gpsIcon.classList.remove("bounce_me");
    }, 1000);
  }
  else{
    gpsIcon.style.setProperty("--color1", 'var(--bs-success)');
    gpsIcon.classList.add("bounce_me");
    setTimeout(function(){
      gpsIcon.classList.remove("bounce_me");
    }, 1000);
  }
});

document.getElementById("joyride").addEventListener("click", function(){
  location.href = "developer.html";
});