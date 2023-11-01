const driveModeButt = document.getElementById("driveModeButt");
const driveModeCancelButt = document.getElementById("driveModeCancelButt");
const exitDriveModeButt = document.getElementById("exitDriveModeButt");
const enterDriveModeButt = document.getElementById("enterDriveModeButt");
const exitDriveModeImg = document.getElementById("exitDriveModeImg");
const enterDriveModeImg = document.getElementById("enterDriveModeImg");
// drive mode setup stuffs
const presetCanvas = document.getElementById("launchPresetOffCanv");
const bsPresetCanvas = new bootstrap.Offcanvas(presetCanvas);

const drivePresetButts = document.getElementById("presetButts");
const joystickPresetButt = document.getElementById("joystickPresetButt");
const autonomyPresetButt = document.getElementById("autonomyPresetButt");

let presetSelected = null;

// confirm drive mode stuffs
const shadowCanvas = document.getElementById("shadowOffCanv");
const shadowCanvUtil = new bootstrap.Offcanvas(shadowCanvas);

const driveModeButts = document.getElementById("driveModeButts");

const driveImg = document.getElementById("driveModeImg");
const drivePushButtHead = document.getElementById("pushDaButton");
const driveHead = document.getElementById("driveModeCountdown");

let isAutoMode = false;
let autoModeInterval = null;

const ROSLIB = require('roslib');
const { automodeClient } = require('./allDaRos');

let isEnableReady = false;
let isAutoButtonPressed = false;

//declared in navbarStuff.js
driveByWire_listener.subscribe(function(message) {
    isEnableReady = message.enable_ready;
    isAutoButtonPressed = message.auto_button_pressed;
});

// drive mode setup stuffs
let disableInterval = null;
driveModeButt.addEventListener("click", function() {
    canvasGoAway = false;
    if(presetSelected && !isAutoMode){
        driveHead.hidden = true;
        drivePushButtHead.hidden = true;
        driveModeButts.hidden = false;
    }
    else if(isAutoMode){
        disableInterval = setInterval(() => {
            makeAutoModeDisableRequest();
        }, 1000);
    }
});

driveModeCancelButt.addEventListener("click", function() {
    driveHead.hidden = true;
    drivePushButtHead.hidden = true;
    drivePushButtHead.style.setProperty("color", "var(--bs-black)");
    driveModeButts.hidden = false;
});

joystickPresetButt.addEventListener("click", function(){
    presetSelected = 'Joystick';
    driveModeButt.innerHTML = "Confirm Joystick Mode";
    driveModeButt.style.setProperty("--color1", "var(--bs-info)");
    exitDriveModeHead.innerHTML = "Exit Joystick Mode";
    enterDriveModeHead.innerHTML = "Enter Joystick Mode";
    exitDriveModeImg.src = "./assets/img/DriveMode/joystick.svg";
    enterDriveModeImg.src = "./assets/img/DriveMode/joystick.svg";
    driveModeButt.setAttribute("data-bs-target", "#shadowOffCanv");
    bsPresetCanvas.hide();
})

autonomyPresetButt.addEventListener("click", function(){
    presetSelected = 'Autonomous';
    driveModeButt.innerHTML = "Confirm Autonomous Mode";
    driveModeButt.style.setProperty("--color1", "var(--bs-info)");
    exitDriveModeHead.innerHTML = "Exit Autonomous Mode";
    enterDriveModeHead.innerHTML = "Enter Autonomous Mode";
    exitDriveModeImg.src = "./assets/img/DriveMode/computron.svg";
    enterDriveModeImg.src = "./assets/img/DriveMode/computron.svg";
    driveModeButt.setAttribute("data-bs-target", "#shadowOffCanv");
    bsPresetCanvas.hide();
})

exitDriveModeButt.addEventListener("click", function(){
    presetSelected = null;
    shadowCanvUtil.hide();
    changeDriveModeButt("Setup");
})

enterDriveModeButt.addEventListener("click", function(){
    driveModeButts.hidden = true;

    drivePushButtHead.classList.remove("blink_me");
    drivePushButtHead.innerHTML = "Making request...";
    drivePushButtHead.hidden = false;
    
    autoModeInterval = setInterval(() => {
        makeAutoModeEnableRequest(presetSelected);
    }, 1500);
});



shadowCanvas.addEventListener('show.bs.offcanvas', function (event) {
    if (driveModeButt.innerHTML.startsWith('Exit')) {
        event.preventDefault();
    }
});

function changeDriveModeButt(driveModeStatus){
    if(driveModeStatus === "Setup"){
        driveModeButt.innerHTML = "Drive Mode Setup";
        driveModeButt.style.setProperty("--color1", "var(--bs-black)");
        driveModeButt.setAttribute("data-bs-target", "#launchPresetOffCanv");
        driveImg.src = `./assets/img/DriveMode/driveModeManual.svg`;
        driveImg.classList.add("bounce_me");
        setTimeout(function(){
            driveImg.classList.remove("bounce_me");
        }, 1000);
        isAutoMode = false;
    }
    else if(driveModeStatus === "Confirm"){
        driveModeButt.innerHTML = "Confirm Drive Mode";
        driveModeButt.style.setProperty("--color1", "var(--bs-info)");
        driveModeButt.setAttribute("data-bs-target", "#shadowOffCanv");
    }
    else if(driveModeStatus === "Joystick"){
        driveImg.src = `./assets/img/DriveMode/driveModeJoystick.svg`;
        driveImg.classList.add("bounce_me");
        setTimeout(function(){
            driveImg.classList.remove("bounce_me");
        }, 1000);
        driveModeButt.innerHTML = "Exit Joystick Mode";
        driveModeButt.style.setProperty("--color1", "var(--bs-gray)");
        isAutoMode = true;
    }
    else if(driveModeStatus === "Autonomous"){
        driveImg.src = `./assets/img/DriveMode/driveModeAutonomous.svg`;
        driveImg.classList.add("bounce_me");
        setTimeout(function(){
            driveImg.classList.remove("bounce_me");
        }, 1000);
        driveModeButt.innerHTML = "Exit Autonomous Mode";
        driveModeButt.style.setProperty("--color1", "var(--bs-gray)");
        isAutoMode = true;
    }
}

let canvasGoAway = false;
function makeAutoModeEnableRequest(){
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
            canvasGoAway = true;
            clearInterval(autoModeInterval);
            // changeDriveModeButt(driveMode);
        }
        else if(maxSucks == 1){
            drivePushButtHead.style.setProperty("color", "var(--bs-warning)");
            drivePushButtHead.innerHTML = "Request timed out. Trying again...";
            changeDriveModeButt("Confirm");
        }
        else if(maxSucks == 2){
            drivePushButtHead.style.setProperty("color", "var(--bs-danger)");
            drivePushButtHead.innerHTML = "System unhealthy";
            changeDriveModeButt("Confirm");
            clearInterval(autoModeInterval);
        }
        else{
            drivePushButtHead.style.setProperty("color", "var(--bs-success)");
            drivePushButtHead.innerHTML = "Already in Autonomous Mode";
            clearInterval(autoModeInterval);
        }
    }, function(error){
            if(error.includes("Service") && error.includes("does not exist")){
                drivePushButtHead.style.setProperty("color", "var(--bs-danger)");
                drivePushButtHead.innerHTML = "Service Does Not Exist";
                clearInterval(autoModeInterval);
            }
            else{
                driveModeButt.innerHTML = error;
                driveModeButt.style.setProperty("--color1", "var(--bs-danger)");
                clearInterval(disableInterval);
            }
        }
    );
}

function makeAutoModeDisableRequest(){
    let request = new ROSLIB.ServiceRequest({
        sender_name: "onboard_interface",
        set_auto_enabled: false,
    });

    automodeClient.callService(request, function(result) {
        console.log(result);
        if(result == 0 || result == 3){
            changeDriveModeButt("Setup");
            clearInterval(disableInterval);
        }
        else if(result == 1){
            driveModeButt.innerHTML = "Timed out. Retrying...";
            driveModeButt.style.setProperty("--color1", "var(--bs-warning)");
        }
        else if(result == 2){
            driveModeButt.innerHTML = "System unhealthy?";
            driveModeButt.style.setProperty("--color1", "var(--bs-danger)");
            clearInterval(disableInterval);
        }
        else{
            driveModeButt.innerHTML = "Got value other than 0 - 3???";;
            driveModeButt.style.setProperty("--color1", "var(--bs-danger)");
            clearInterval(disableInterval);
            setTimeout(function(){
                driveModeButt.innerHTML = `Exit ${presetSelected} mode`;
                driveModeButt.style.setProperty("--color1", "var(--bs-gray");
            }, 3000);
        }
        
    }, function(error){
            if(error.includes("Service") && error.includes("does not exist")){
                drivePushButtHead.style.setProperty("color", "var(--bs-danger)");
                drivePushButtHead.innerHTML = "Service Does Not Exist";
                clearInterval(autoModeInterval);
            }
            else{
                driveModeButt.innerHTML = error;
                driveModeButt.style.setProperty("--color1", "var(--bs-danger)");
                clearInterval(disableInterval);
            }
        }
    );
}

setInterval(function(){
    if(isEnableReady && isAutoButtonPressed){
        if(currentDriveMode == "Autonomy"){
            // changeToggleButton("Autonomy");
            changeDriveModeButt("Autonomous");
        }
        else if(currentDriveMode == "Joystick"){
            // changeToggleButton("Joystick");
            changeDriveModeButt("Joystick");
            // driveImg.src = "./assets/img/DriveMode/driveModeJoystick.svg";
            // driveImg.classList.add("bounce_me");
            // setTimeout(function(){
            //     driveImg.classList.remove("bounce_me");
            // }, 1000);
        }
        if(canvasGoAway){
            shadowCanvUtil.hide();
        }
    }
}, 1000);
