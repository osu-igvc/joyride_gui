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
drivePushButtHead.classList.add("blink_me");

let autoModeInterval = null;

const ROSLIB = require('roslib');
const { automodeClient } = require('./allDaRos');

toggleDriveModeButt.onclick = () => {
    driveHead.hidden = true;
    drivePushButtHead.hidden = true;
    driveModeButts.hidden = false;
    if (countdown){
        clearInterval(countdown);
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
}

function changeToggleButton(currentMode){
    toggleDriveModeButt.innerHTML = `Exit ${currentMode} Mode`;
}


function makeAutoModeRequest(enableDisable){
    let request = new ROSLIB.ServiceRequest({
        string: "onboard_interface",
        bool: enableDisable,
    });

    automodeClient.callService(request, function(result) {
        drivePushButtHead.classList.remove("blink_me");
        console.log(result);
        if(result == 0){
            drivePushButtHead.style.setProperty("color", "var(--bs-black)");
            drivePushButtHead.innerHTML = "Requesting Autonomous Mode...";
        }
        else if(result == 1){
            drivePushButtHead.style.setProperty("color", "var(--bs-warning)");
            drivePushButtHead.innerHTML = "Request timed out";
        }
        else if(result == 2){
            drivePushButtHead.style.setProperty("color", "var(--bs-danger)");
            drivePushButtHead.innerHTML = "System unhealthy";
            clearInterval(autoModeInterval);
        }
        else{
            drivePushButtHead.style.setProperty("color", "var(--bs-success)");
            drivePushButtHead.innerHTML = "Already in Autonomous Mode";
            clearInterval(autoModeInterval);
        }
    });
}

manualButt.addEventListener("click", function(){
    driveImg.src = "./assets/img/DriveMode/driveModeManual.svg";
    shadowCanvasUtil.hide();
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
    drivePushButtHead.hidden = false;
});

function autonomyCountdown(){
    count = 5;
    driveModeButts.hidden = true;

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
    drivePushButtHead.hidden = false;
    autoModeInterval = setInterval(() => {
        makeAutoModeRequest(true);
    }, 1000);
});


  