
function updateSteeringAngle(angle){
  let angleDeg = Math.round(angle * 180/Math.PI);
  let angleRad = angle.toFixed(2);
  document.getElementById("steerValue").innerHTML = -angleDeg.toString() + '°' + ", " + -angleRad + " rads";
  document.getElementById("steeringAngleDiv").style.transform = 'rotate('+ angleDeg + 'deg)'
}

function updateSpeed(speed){
  let speedMs = speed.toFixed(1);
  let speedMph = (speed * 2.237).toFixed(1);
  document.getElementById("speedValue").innerHTML = speedMph + ' mph' + ", " + speedMs + " m/s";
  document.getElementById("speedTick").style.transform = 'rotate(' + (speedMph * 240/24 - 30) + 'deg)';
}

const { steeringAngle_listener, wheelSpeed_listener } = require('./allDaRos.js');

steeringAngle_listener.subscribe((message) => {
  updateSteeringAngle(message.position_radians);
});

wheelSpeed_listener.subscribe((message) => {
  updateSpeed(message.data);
});






