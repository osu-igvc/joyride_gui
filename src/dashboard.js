
function updateSteeringAngle(angle){
  let angleDeg = Math.round(angle * 180/Math.PI);
  let angleRad = angle.toFixed(2);
  document.getElementById("steerValue").innerHTML = -angleDeg.toString() + '°' + ", " + -angleRad + " rads";
  document.getElementById("steeringAngleDiv").style.transform = 'rotate('+ angleDeg + 'deg)'
}

function updateSpeed(speed){
  let speedMs = speed.toFixed(1);
  let speedMph = Math.round(speed * 2.237);
  document.getElementById("speedValue").innerHTML = speedMph + ' mph' + ", " + speedMs + " m/s";
  document.getElementById("actualSpeedTick").style.transform = 'rotate(' + (speedMph * 240/24 - 30) + 'deg)';
}

function updateExpectedSpeed(speed){
  let speedMph = Math.round(speed * 2.237);
  document.getElementById("expectedSpeedTick").style.transform = 'rotate(' + (speedMph * 240/24 - 30) + 'deg)';
}

function updateActualSteeringAngle(angle){
  let angleDeg = Math.round(angle * 180/Math.PI);
  let angleRad = angle.toFixed(2);
  document.getElementById("actualSteeringAngleValue").innerHTML = angleDeg.toString() + '°' + ", " + angleRad + " rads";
  document.getElementById("actualLeftWheelSVG").style.transform = `translate(0%, -112%) rotate(${angleDeg}deg)`;
  document.getElementById("actualRightWheelSVG").style.transform = `translate(0%, -112%) rotate(${angleDeg}deg)`;

}

function updateExpectedSteeringAngle(angle){
  let angleDeg = Math.round(angle * 180/Math.PI);
  let angleRad = angle.toFixed(2);
  document.getElementById("expectedLeftWheelSVG").style.transform = `translate(0%, -112%) rotate(${angleDeg}deg)`;
  document.getElementById("expectedRightWheelSVG").style.transform = `translate(0%, -112%) rotate(${angleDeg}deg)`;
}

const { steeringAngle_listener, wheelSpeed_listener } = require('./allDaRos.js');

steeringAngle_listener.subscribe((message) => {
  updateSteeringAngle(message.position_radians);
});

wheelSpeed_listener.subscribe((message) => {
  updateSpeed(message.data);
});


document.getElementById("seatBeltIcon").addEventListener("click", () => {
  updateActualSteeringAngle(Math.random() * Math.PI/2 - Math.PI/4);
  updateExpectedSteeringAngle(Math.random() * Math.PI/2 - Math.PI/4);
  updateExpectedSpeed(Math.random() * 10);
  updateSpeed(Math.random() * 10);
});





