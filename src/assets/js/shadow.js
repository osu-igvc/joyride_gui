let shadowCanvas = document.getElementById("shadowOffCanv");
let shadowCanvasUtil = new bootstrap.Offcanvas(shadowCanvas);

let driveModeButts = document.getElementById("driveModeButts");
let manualButt = document.getElementById("manualButt");
let joystickButt = document.getElementById("joystickButt");
let autonomyButt = document.getElementById("autonomyButt");

let driveImg = document.getElementById("driveModeImg");
let drivePushButtHead = document.getElementById("pushDaButton");
let driveHead = document.getElementById("driveModeCountdown");

let countdown = null;
let count = 5;

document.getElementById("toggleDriveModeButt").onclick = () => {
    driveHead.hidden = true;
    drivePushButtHead.hidden = true;
    driveModeButts.hidden = false;
    if (countdown){
        clearInterval(countdown);
    }
}

document.getElementById("driveModeCancelButt").onclick = () => {                       driveHead.hidden = true;
    drivePushButtHead.hidden = true;
    driveModeButts.hidden = false;
    if (countdown){
        clearInterval(countdown);
    }
}

manualButt.addEventListener("click", function(){
    driveImg.src = "DriveMode/driveModeManual.svg";
    shadowCanvasUtil.hide();
});

joystickButt.addEventListener("click", function(){
    count = 5;
    driveModeButts.hidden = true;
    driveHead.innerHTML = `Joystick Control Begins in ${count}`;
    driveHead.hidden = false;
    countdown = setInterval(() => {
        --count;
        if(count <= 0){
            shadowCanvasUtil.hide();
            driveModeButts.hidden = false;
            driveImg.src = "DriveMode/driveModeJoystick.svg";
            clearInterval(countDown);

        }
        else{
            driveHead.innerHTML = `Joystick Control Begins in ${count}`;
        }
    }, 1000);
});

autonomyButt.addEventListener("click", function(){
    count = 5;
    driveModeButts.hidden = true;
    driveHead.innerHTML = `Autonomous Control Begins in ${count}`;
    driveHead.hidden = false;
    countdown = setInterval(() => {
        --count;
        if(count <= 0){
            shadowCanvasUtil.hide();
            driveModeButts.hidden = false;
            driveImg.src = "DriveMode/driveModeAutonomy.svg";
            clearInterval(countDown);

        }
        else{
            driveHead.innerHTML = `Autonomous Control Begins in ${count}`;
        }
    }, 1000);
});