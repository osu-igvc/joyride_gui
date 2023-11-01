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

// dbw listener already declared in navbarstuff
let isEnableReady = false;
let isAutoButtonPressed = false;
let isHardwareAutoEnable = false;
let isHealthy = false;
driveByWire_listener.subscribe(function(message) {
    isEnableReady = message.enable_ready;
    isAutoButtonPressed = message.auto_mode_active;
    isHardwareAutoEnable = message.hardware_auto_enable;
});

const { systemHealth_listener } = require('./allDaRos');

systemHealth_listener.subscribe(function(message){
    isHealthy = message.system_status == 0;
});

let isAutoMode = false;
setInterval(function(){
    if(!isAutoMode){
        if(isHealthy){
            driveModeButt.classList.remove("disabled");
            driveModeButt.innerHTML = "Enter Autonomy";
        }
        else{
            driveModeButt.classList.add("disabled");
            driveModeButt.innerHTML = "System Not Fit To Enter Autonomy";
        }
        
    }

    if(!isHealthy && isAutoMode){
        isAutoMode = false;
    }

    if(isHardwareAutoEnable){
        isAutoMode = true;
        shadowCanvUtil.hide();
        driveHead.style.setProperty("visibility", "hidden");
        driveModeButt.style.setProperty("--color1", "var(--bs-gray-500)");
        driveModeButt.innerHTML = "Exit Autonomy";
    }

    if(isAutoButtonPressed){
        shadowCanvUtil.hide();
        driveModeButt.innerHTML = "Exit Autonomy";
        driveModeButt.style.setProperty("--color1", "var(--bs-gray-500)");
    }

    
}, 1000);

let disableRequestInterval = null;
let enableRequestInterval = null;

driveModeButt.addEventListener("click", function(){
    if(isAutoMode){
        // Exit auto mode
        disableRequestInterval = setInterval(function(){
            makeAutoModeDisableRequest();
        }, 1000);
        
    }
    else{
        enableRequestInterval = setInterval(function(){
            makeAutoModeEnableRequest();
        }, 1000);
        shadowCanvUtil.show();
    }
    driveModeButt.classList.add("disabled");
    setTimeout(function(){
        driveModeButt.classList.remove("disabled");
    }, 1500);
});

driveModeCancelButt.addEventListener("click", function(){
    disableRequestInterval = setInterval(function(){
        makeAutoModeDisableRequest();
    }, 1000);
});

function makeAutoModeDisableRequest(){
    let disable_request = new ROSLIB.ServiceRequest({
        sender_name: "onboard_interface",
        set_auto_enabled: false,
    });
    automodeClient.callService(disable_request, function(result){
        if(result.response == 0 || result.response == 3){
            isAutoMode = false;
            driveModeButt.innerHTML = "Enter Autonomy";
            driveModeButt.style.setProperty("--color1", "var(--bs-black)");
            // driveHead.style.setProperty("visibility", "visible");
            clearInterval(disableRequestInterval);
        }
        else if(result.response == 1){
            // Timed out
            driveModeButt.innerHTML = "Request Timed Out. Retrying...";
            driveModeButt.style.setProperty("--color1", "var(--bs-warning)");
        }
        else if(result.response == 2){
            // System Unhealthy
            driveModeButt.innerHTML = "System Unhealthy";
            driveModeButt.style.setProperty("--color1", "var(--bs-danger)");
            clearInterval(disableRequestInterval);
            setTimeout(function(){
                driveModeButt.innerHTML = "Exit Autonomy";
                driveModeButt.style.setProperty("--color1", "var(--bs-gray-500)");
            }, 4000);
        }
    }), function(error){
        if(error.includes("Service") && error.includes("does not exist")){
            driveModeButt.innerHTML = "Service does not exist";
            driveModeButt.style.setProperty("--color1", "var(--bs-danger)");
            clearInterval(disableRequestInterval);
            setTimeout(function(){
                driveModeButt.innerHTML = "Exit Autonomy";
                driveModeButt.style.setProperty("--color1", "var(--bs-gray-500)");
            }, 4000);
        }
    }
}

function makeAutoModeEnableRequest(){
    let enable_request = new ROSLIB.ServiceRequest({
        sender_name: "onboard_interface",
        set_auto_enabled: true,
    });
    automodeClient.callService(enable_request, function(result){
        if(result.response == 0 || result.response == 3){
            isAutoMode = true;
            clearInterval(enableRequestInterval);
        }
        else if(result.response == 1){
            // Timed out
            driveHead.innerHTML = "Request Timed Out. Retrying...";
            driveHead.style.setProperty("--color1", "var(--bs-warning)");
        }
        else if(result.response == 2){
            // System Unhealthy
            driveHead.innerHTML = "System Unhealthy";
            driveHead.style.setProperty("--color1", "var(--bs-danger)");
            clearInterval(enableRequestInterval);
        }
    }), function(error){
        if(error.includes("Service") && error.includes("does not exist")){
            driveHead.innerHTML = "Service does not exist";
            driveHead.style.setProperty("--color1", "var(--bs-danger)");
            clearInterval(enableRequestInterval);
        }
    }
}