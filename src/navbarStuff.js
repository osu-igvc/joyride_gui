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
    document.getElementById("systemShutdownButt").innerHTML = "Cancel Shutdown";
    document.getElementById("systemShutdownButt").style.setProperty("--color1", "var(--bs-warning)");
  }
  document.getElementById("status").style.setProperty("--color1", "var(--bs-danger)");
  document.getElementById("status").innerHTML = `Shutdown in: ${time}`;
});

const { ros } = require("./allDaRos.js");
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
let gpuTemperature = 0;
let cpuTemperature = 0;

function handleDBWIcon(color, shouldBounce) {
  const dbwIcon = document.getElementById("dbwIcon");
  if (dbwIcon) {
    dbwIcon.style.setProperty("--color1", color);
    if (shouldBounce) {
      dbwIcon.classList.add("bounce_me");
      setTimeout(function(){
        dbwIcon.classList.remove("bounce_me");
      }, 1000);
    }
  }
}

// Check if diagnosticMessages stopped coming in
let lastMessageTime = Date.now();
setInterval(function(){
  if(Date.now() - lastMessageTime > 3000){
    handleDBWIcon("var(--bs-danger)", true);
    heatedSeatsOnOff(9999);
  }
}, 1000);

diagnosticMessages_listener.subscribe(function(message){
  lastMessageTime = Date.now();
  diagnosticMessages = message.status.map((status) => {
    return {
      name: status.name,
      level: status.level,
      message: status.message
    }
  });
  let overallStatus = "var(--bs-success)";
  let msg = "No Warnings";
  let level = 0;
  let drive_controller = false;
  let power_steering = false;
  let polaris_gem = false;
  let accessory_controller = false;
  
  setInterval(function(){
    // console.log(`GPU: ${gpuTemperature}, CPU: ${cpuTemperature}, Max: ${Math.max(gpuTemperature, cpuTemperature)}`);
    if(drive_controller && power_steering && polaris_gem){
      if(!accessory_controller){
        handleDBWIcon("var(--bs-warning", false);
      }
      else{
        handleDBWIcon("var(--bs-success)", false);
      }
    }
    else{
      handleDBWIcon("var(--bs-danger)", false);
    }

  }, 2000);

  diagnosticMessages.forEach((status) => {
    if(status.name){
      if(status.name.toLowerCase().includes("drive")){
        // console.log(DBW);
        drive_controller = status.level == 0;
      }
      else if(status.name.toLowerCase().includes("steering")){
        power_steering = status.level == 0;
      }
      else if(status.name.toLowerCase().includes("gem")){
        polaris_gem = status.level == 0;
      }
      else if(status.name.toLowerCase().includes("accessory")){
        accessory_controller = status.level == 0;
      }
      else if(status.name.toLowerCase().includes("utility")){
        if(status.message && status.name.toLowerCase().includes("gpu")){
          if(status.level == 0){
            let temperatureString = status.message.split(", ")[1];
            gpuTemperature = parseInt(temperatureString);
          }
          else{
            gpuTemperature = 999;
          }
          heatedSeatsOnOff(Math.max(gpuTemperature, cpuTemperature));
        }
        else if(status.message && status.name.toLowerCase().includes("cpu") && status.level == 0){
          if(status.level == 0){
            let temperatureString = status.message.split(", ")[1];
            cpuTemperature = parseInt(temperatureString);
          }
          else{
            cpuTemperature = 999;
          }
          heatedSeatsOnOff(Math.max(gpuTemperature, cpuTemperature));
        }
      }
    }
    if(status.level > level && status.level < 3){
      level = status.level;
      msg = status.name.split('/')[2];
    }
  });

  if(!nagasaki){
    if(level === 0){
      overallStatus = "var(--bs-success)";
    }
    else if(level === 1){
      overallStatus = "var(--bs-warning)";
    }
    else if(level === 2){
      overallStatus = "var(--bs-danger)";
    }
    else{
      overallStatus = "var(--bs-gray-500)";
    }
    const statusElement = document.getElementById("status");
    if (statusElement) {
      statusElement.style.setProperty("--color1", overallStatus);
      statusElement.innerHTML = msg;
    }
  }
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

let previousTemp = 0;
function heatedSeatsOnOff(temp){
  function getColor(value) {
    // Ensure value is within 0-100
    value = Math.min(100, Math.max(0, value));

    // Define color ranges
    const colorRanges = [
        {start: 0, end: 30, color: {red: 75, green: 191, blue: 115}}, // #4bbf73
        {start: 30, end: 50, color: {red: 240, green: 173, blue: 78}}, // #f0ad4e
        {start: 50, end: 70, color: {red: 253, green: 126, blue: 20}}, // #fd7e14
        {start: 70, end: 100, color: {red: 217, green: 83, blue: 79}} // #d9534f
    ];

    // Find the color range that the value falls within
    let startColor, endColor, ratio;
    for (let i = 0; i < colorRanges.length - 1; i++) {
        if (value >= colorRanges[i].start && value <= colorRanges[i + 1].end) {
            startColor = colorRanges[i].color;
            endColor = colorRanges[i + 1].color;
            ratio = (value - colorRanges[i].start) / (colorRanges[i + 1].end - colorRanges[i].start);
            break;
        }
    }

    // If no range found (should not happen), default to first color
    if (!startColor || !endColor) {
        startColor = endColor = colorRanges[0].color;
        ratio = 0;
    }

    // Interpolate between the start and end color
    let red = Math.round(startColor.red + ratio * (endColor.red - startColor.red));
    let green = Math.round(startColor.green + ratio * (endColor.green - startColor.green));
    let blue = Math.round(startColor.blue + ratio * (endColor.blue - startColor.blue));

    // Convert to hex color
    const hexColor = "#" + ((1 << 24) | ((red << 16) | (green << 8) | blue)).toString(16).slice(1);

    return hexColor;
  }

  document.getElementById("heatedSeatsIcon").style.setProperty("--color1", getColor(temp));
  if(temp >= 80 && previousTemp < 80){
    document.getElementById("heatedSeatsIcon").classList.add("bounce_me");
    setTimeout(function(){
      document.getElementById("heatedSeatsIcon").classList.remove("bounce_me");
    }, 1000);
  }
  previousTemp = temp;
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
const { set } = require('date-fns');

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
  document.getElementById("dbwIcon").style.setProperty("--color1", isDriveByWire ? 'var(--bs-success)' : 'var(--bs-danger)');
  document.getElementById("dbwIcon").classList.add("bounce_me");
  setTimeout(function(){
    document.getElementById("dbwIcon").classList.remove("bounce_me");
  }, 1000);
}

let previousEStop = false;
let previousPBrake = false;
let previousDriveByWire = false;
driveByWire_listener.subscribe((message) => {
  if(previousEStop != message.estop_pressed){
    eStopOnOff(message.estop_pressed);
    previousEStop = message.estop_pressed;
  }

  if(previousPBrake != message.parking_brake_active){
    pBrakeOnOff(message.parking_brake_active);
    previousPBrake = message.parking_brake_active;
  }

  // if(previousDriveByWire != message.enable_ready){
  //   driveByWireOnOff(message.enable_ready);
  //   previousDriveByWire = message.enable_ready;
  // }
});

// Fill gps stuff cause too lazy to change html
/* style="display: inline;fill: #000000;fill-opacity: 1;stroke: #000000;stroke-width: 3.92833;stroke-opacity: 1;" */
document.getElementById("gpsIcon_marker").style.setProperty("fill-opacity", '0');
document.getElementById("gpsIcon_marker").style.setProperty("fill", "#000000");
document.getElementById("gpsIcon_marker").style.setProperty("stroke-width", '9.92833');
document.getElementById("gpsIcon_bar1").style.setProperty("stroke-width", '3.22833');
document.getElementById("gpsIcon_bar2").style.setProperty("stroke-width", '3.22833');
document.getElementById("gpsIcon_bar3").style.setProperty("stroke-width", '3.22833');
document.getElementById("gpsIcon_bar4").style.setProperty("stroke-width", '3.22833');

previousFix = 0;
previousNumSats = 0;
gps_listener.subscribe((message) => {
  if(previousFix != message.fix || previousNumSats != message.numsats){
    document.getElementById("gpsIcon_marker").style.setProperty('fill-opacity', message.fix >= 3 ? '1' : '0');
    document.getElementById("gpsIcon_bar1").style.setProperty('fill-opacity',  message.numsats >= 1 ? '1' : '0');
    document.getElementById("gpsIcon_bar2").style.setProperty('fill-opacity',  message.numsats >= 2 ? '1' : '0');
    document.getElementById("gpsIcon_bar3").style.setProperty('fill-opacity', message.numsats >= 3 ? '1' : '0');
    document.getElementById("gpsIcon_bar4").style.setProperty('fill-opacity', message.numsats >= 4 ? '1' : '0');

    let gpsIcon = document.getElementById("gpsIcon");
    if(message.numsats <= 1 || message.fix < 3){
      gpsIcon.style.setProperty("--color1", 'var(--bs-danger)');
      // gpsIcon.classList.add("bounce_me");
      // setTimeout(function(){
      //   gpsIcon.classList.remove("bounce_me");
      // }, 1000);
    }
    else if(message.numsats >= 2 && message.numsats <= 3 && message.fix >= 3){
      gpsIcon.style.setProperty("--color1", 'var(--bs-warning)');
      // gpsIcon.classList.add("bounce_me");
      // setTimeout(function(){
      //   gpsIcon.classList.remove("bounce_me");
      // }, 1000);
    }
    else{
      gpsIcon.style.setProperty("--color1", 'var(--bs-success)');
      // gpsIcon.classList.add("bounce_me");
      // setTimeout(function(){
      //   gpsIcon.classList.remove("bounce_me");
      // }, 1000);
    }
  } 
  previousFix = message.fix;
  previousNumSats = message.numsats;
});

document.getElementById("joyride").addEventListener("click", function(){
  location.href = "developer.html";
});

document.getElementById("status").addEventListener("click", function(){
  // console.log("status clicked");
  location.href = "systemHealth.html";
});