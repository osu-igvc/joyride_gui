let shadowCanvas = document.getElementById("shadowOffCanv");
let shadowCanvasUtil = new bootstrap.Offcanvas(shadowCanvas);

let toggleDriveModeButt = document.getElementById("toggleDriveModeButt");

let driveModeButts = document.getElementById("driveModeButts");
let manualButt = document.getElementById("manualButt");
let joystickButt = document.getElementById("joystickButt");
let autonomyButt = document.getElementById("autonomyButt");

let driveImg = document.getElementById("driveModeImg");
let drivePushButtHead = document.getElementById("pushDaButton");
let driveHead = document.getElementById("driveModeCountdown");

let countdown = null;
let count = 5;

let autoModeInterval = null;

const ROSLIB = require('roslib');
const { automodeClient } = require('./allDaRos');

let isEnableReady = false;
let isAutoButtonPressed = false;
let currentDriveMode = "Manual";

//declared in navbarStuff.js
driveByWire_listener.subscribe(function(message) {
    isEnableReady = message.enable_ready;
    isAutoButtonPressed = message.auto_button_pressed;
});

toggleDriveModeButt.onclick = () => {
    driveHead.hidden = true;
    drivePushButtHead.hidden = true;
    driveModeButts.hidden = false;
    if (countdown){
        clearInterval(countdown);
    }
    if (autoModeInterval){
        clearInterval(autoModeInterval);
    }
    if(currentDriveMode == "Manual"){
        shadowCanvasUtil.show();
        shadowCanvasUtil.hidden = false;
    }
    else{
        makeAutoModeDisableRequest();
    }
    
}

document.getElementById("driveModeCancelButt").onclick = () => {
    driveHead.hidden = true;
    drivePushButtHead.hidden = true;
    driveModeButts.hidden = false;
    if (countdown){
        clearInterval(countdown);
    }
    if (autoModeInterval){
        clearInterval(autoModeInterval);
    }
    currentDriveMode = "Manual";
}

function changeToggleButton(currentMode){
    shadowCanvasUtil.hidden = true;
    shadowCanvasUtil.hide();
    toggleDriveModeButt.innerHTML = `Exit ${currentMode} Mode`;
}

function makeAutoModeEnableRequest(driveMode){
    drivePushButtHead.style.setProperty("color", "var(--bs-black)");
    let request = new ROSLIB.ServiceRequest({
        sender_name: "onboard_interface",
        set_auto_enabled: true,
    });

    automodeClient.callService(request, function(result) {
        let maxSucks = result.response;
        if(maxSucks == 0){
            drivePushButtHead.style.setProperty("color", "var(--bs-black)");
            drivePushButtHead.innerHTML = "Press Automode Button";
            drivePushButtHead.classList.add("blink_me");
            currentDriveMode = driveMode;
            clearInterval(autoModeInterval);
        }
        else if(maxSucks == 1){
            drivePushButtHead.style.setProperty("color", "var(--bs-warning)");
            drivePushButtHead.innerHTML = "Request timed out. Trying again...";
        }
        else if(maxSucks == 2){
            drivePushButtHead.style.setProperty("color", "var(--bs-danger)");
            drivePushButtHead.innerHTML = "System unhealthy";
            clearInterval(autoModeInterval);
        }
        else{
            drivePushButtHead.style.setProperty("color", "var(--bs-success)");
            drivePushButtHead.innerHTML = "Already in Autonomous Mode";
            currentMode = driveMode;
            clearInterval(autoModeInterval);
        }
    });
}

function makeAutoModeDisableRequest(){
    let request = new ROSLIB.ServiceRequest({
        string: "onboard_interface",
        bool: false,
    });

    automodeClient.callService(request, function(result) {
        console.log(result);
        if(result == 0 || result == 3){
            toggleDriveModeButt.innerHTML = "Toggle Drive Mode";
            currentDriveMode = "Manual";
            toggleDriveModeButt.style.backgroundColor = "var(--bs-black)";
        }
        else if(result == 1){
            toggleDriveModeButt.innerHTML = "Request timed out. Trying again...";
            toggleDriveModeButt.style.backgroundColor = "var(--bs-warning)";
        }
        else if(result == 2){
            toggleDriveModeButt.innerHTML = "System unhealthy?";
            toggleDriveModeButt.style.backgroundColor = "var(--bs-danger)";
        }
        else{
            toggleDriveModeButt.innerHTML = "Got value other than 0 - 3???";;
            toggleDriveModeButt.style.backgroundColor = "var(--bs-danger)";
        }
    });
}

manualButt.addEventListener("click", function(){
    driveImg.src = "./assets/img/DriveMode/driveModeManual.svg";
    shadowCanvasUtil.hide();
    document.getElementById("toggleDriveModeButt").innerHTML = "Toggle Drive Mode";
});

function joystickCountdown(){
    drivePushButtHead.hidden = true;
    count = 5;
    driveHead.innerHTML = `Joystick Control Begins in ${count}`;
    driveHead.hidden = false;
    countdown = setInterval(() => {
        --count;
        if(count <= 0){
            shadowCanvasUtil.hide();
            driveModeButts.hidden = false;
            driveImg.src = "./assets/img/DriveMode/driveModeJoystick.svg";
            clearInterval(countdown);

        }
        else{
            driveHead.innerHTML = `Joystick Control Begins in ${count}`;
        }
    }, 1000);
}

joystickButt.addEventListener("click", function(){
    driveModeButts.hidden = true;
    driveHead.hidden = true;
    drivePushButtHead.classList.remove("blink_me");
    drivePushButtHead.innerHTML = "Making request...";
    drivePushButtHead.hidden = false;
    autoModeInterval = setInterval(() => {
        makeAutoModeRequest("Joystick");
    }, 3000);
});

function autonomyCountdown(){
    count = 5;
    driveModeButts.hidden = true;
    drivePushButtHead.hidden = false;
    driveHead.innerHTML = `Autonomous Control Begins in ${count}`;
    driveHead.hidden = false;
    countdown = setInterval(() => {
        --count;
        if(count <= 0){
            shadowCanvasUtil.hide();
            driveModeButts.hidden = false;
            driveImg.src = "./assets/img/DriveMode/driveModeAutonomy.svg";
            clearInterval(countdown);

        }
        else{
            driveHead.innerHTML = `Autonomous Control Begins in ${count}`;
        }
    }, 1000);
}

autonomyButt.addEventListener("click", function(){
    driveModeButts.hidden = true;
    driveHead.hidden = true;
    drivePushButtHead.classList.remove("blink_me");
    drivePushButtHead.innerHTML = "Making request...";
    drivePushButtHead.hidden = false;
    autoModeInterval = setInterval(() => {
        makeAutoModeEnableRequest("Autonomy");
    }, 3000);
});

if(isEnableReady && isAutoButtonPressed){
    if(currentDriveMode == "Autonomy"){
        changeToggleButton("Autonomy");
        driveImg.src = "./assets/img/DriveMode/driveModeAutonomy.svg";
        driveImg.classList.add("bounce_me");
        setTimeout(function(){
            driveImg.classList.remove("bounce_me");
        }, 1000);
    }
    else if(currentDriveMode == "Joystick"){
        changeToggleButton("Joystick");
        driveImg.src = "./assets/img/DriveMode/driveModeJoystick.svg";
        driveImg.classList.add("bounce_me");
        setTimeout(function(){
            driveImg.classList.remove("bounce_me");
        }, 1000);
    }
}
