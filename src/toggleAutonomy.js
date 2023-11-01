const ROSLIB = require('roslib');
const { automodeClient } = require('./allDaRos');

const driveModeButt = document.getElementById("driveModeButt");
const driveModeCancelButt = document.getElementById("driveModeCancelButt");

const shadowCanvas = document.getElementById("shadowOffCanv");
const shadowCanvUtil = new bootstrap.Offcanvas(shadowCanvas);

const driveImg = document.getElementById("driveModeImg");
const drivePushButtHead = document.getElementById("pushDaButton");
const driveHead = document.getElementById("driveModeCountdown");

let isCanvas = false;
shadowCanvas.addEventListener("show.bs.offcanvas", function(){
    isCanvas = true;
});

shadowCanvas.addEventListener("hide.bs.offcanvas", function(){
    isCanvas = false;
});

// Already declared in navbarstuff
driveByWire_listener.subscribe(function(message) {
    isEnableReady = message.enable_ready;
    isAutoButtonPressed = message.auto_button_pressed;
});

setInterval(function(){
    if(isEnableReady && isAutoButtonPressed){
        shadowCanvUtil.hide();
        driveHead.style.setProperty("visibility", "hidden");
        driveModeButt.style.setProperty("--color1", "var(--bs-gray-500)");
        driveModeButt.innerHTML = "Exit Autonomy";
    }
}, 1000);

let automode = false;
driveModeButt.addEventListener("click", function(){
    if(!automode){
        shadowCanvUtil.show();
        automode = true;
    }
    else{
        // Exit auto mode
        makeAutoModeDisableRequest();
    }
});

let countdownInterval = null;
let countdownValue = 5;
function makeAutoModeEnableRequest(){
    let request = new ROSLIB.ServiceRequest({
        sender_name: "onboard_interface",
        set_auto_enabled: false,
    });

    automodeClient.callService(request, function(result) {
        console.log(result);
        const maxSucks = result.response;
        if(maxSucks == 0 || maxSucks == 3){
            driveHead.style.setProperty("--color1", "var(--bs-black)");
            // Good to go
            countdownInterval = setInterval(function(){
                driveHead.innerHTML = `Autonomy Begins in ${countdownValue}`;
                if(countdownValue == 0){
                    shadowCanvUtil.hide();
                    countdownValue = 5;
                    clearInterval(countdownInterval);
                }
                countdownValue--;
            }, 1000);
            driveHead.style.setProperty("visibility", "visible");
            
        }
        else if(maxSucks == 1){
            // Timed out
            driveHead.innerHTML = "Request Timed Out. Retrying...";
            driveHead.style.setProperty("--color1", "var(--bs-warning)");
        }
        else if(maxSucks == 2){
            //. System Unhealthy
            driveHead.innerHTML = "System Unhealthy";
            driveHead.style.setProperty("--color1", "var(--bs-danger)");
            
        }
        else{
            // Something bad happened
            driveHead.innerHTML = "Got value other than 0 - 3???";
            driveHead.style.setProperty("--color1", "var(--bs-danger)");
            
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
        const maxSucks = result.response;
        if(maxSucks == 0 || maxSucks == 3){
            // Good to go
            driveModeButt.style.setProperty("--color1", "var(--bs-black)");
            driveModeButt.innerHTML = "Enter Autonomy";
            automode = false;
        }
        else if(maxSucks == 1){
            // Timed out
            driveModeButt.style.setProperty("--color1", "var(--bs-warning)");
            driveModeButt.innerHTML = "Request timed out. Retrying...";
        }
        else if(maxSucks == 2){
            //. System Unhealthy
            driveModeButt.style.setProperty("--color1", "var(--bs-danger)");
            driveModeButt.innerHTML = "System Unhealthy";
        }
        else{
            // Something bad happened
            driveModeButt.style.setProperty("--color1", "var(--bs-danger)");
            driveModeButt.innerHTML = `Error: Received ${maxSucks}`;
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