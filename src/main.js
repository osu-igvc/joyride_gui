
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

const steeringAngle_listener1 = new ROSLIB.Topic({
  ros: ros,
  name: "/feedback/steer_angle",
  messageType: "std_msgs/msg/Float32"
});

const wheelSpeed_listener1 = new ROSLIB.Topic({
  ros: ros,
  name: "/feedback/wheelspeed",
  messageType: "std_msgs/msg/Float32"
});

steeringAngle_listener1.subscribe((message) => {
  updateSteeringAngle(message.data);
});

wheelSpeed_listener1.subscribe((message) => {
  updateSpeed(message.data);
});

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




