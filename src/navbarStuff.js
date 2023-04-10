document.getElementById("navTime").innerHTML = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
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
  leftBlinker = message.left_turn_signal_on;
  rightBlinker = message.right_turn_signal_on;
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

driveByWire_listener.subscribe((message) => {
  eStopOnOff(message.estop_active);
  pBrakeOnOff(message.parking_brake_active);
  driveByWireOnOff(message.enable_ready);

});

gps_listener.subscribe((message) => {
  document.getElementById("gypsyIcon_marker").fill = message.fix >= 3 ? 'var(--bs-black)' : '#00FFFFFF';
  document.getElementById("gypsyIcon_bar1").fill = message.numsats >= 1 ? 'var(--bs-black)' : '#00FFFFFF';
  document.getElementById("gypsyIcon_bar2").fill = message.numsats >= 2 ? 'var(--bs-black)' : '#00FFFFFF';
  document.getElementById("gypsyIcon_bar3").fill = message.numsats >= 3 ? 'var(--bs-black)' : '#00FFFFFF';
  document.getElementById("gypsyIcon_bar4").fill = message.numsats >= 4 ? 'var(--bs-black)' : '#00FFFFFF';

  let gpsIcon = document.getElementById("gypsyIcon");
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
