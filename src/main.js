// Create ros object to communicate over your Rosbridge connection
const ROSLIB = require('roslib');
const ros = new ROSLIB.Ros({ url: "ws://localhost:9190" });
// When the Rosbridge server connects, fill the span with id "status" with "successful"
ros.on("connection", () => {
  document.getElementById("status").innerHTML = "successful";
  console.log("connected");
});

// // When the Rosbridge server experiences an error, fill the "status" span with the returned error
ros.on("error", (error) => {
  document.getElementById("status").innerHTML = `errored out (${error})`;
});

// // When the Rosbridge server shuts down, fill the "status" span with "closed"
ros.on("close", () => {
  document.getElementById("status").innerHTML = "closed";
});


function updateSteeringAngle(angle){
  let angleDeg = Math.round(angle * 180/Math.PI);
  let angleRad = angle.toFixed(2);
  document.getElementById("steerValue").innerHTML = -angleDeg.toString() + '°' + ", " + -angleRad + " rads";
  document.getElementById("steeringAngle").style.transform = 'rotate('+ angleDeg + 'deg)'
}

function updateSpeed(speed){
  let speedMs = speed.toFixed(2);
  let speedMph = Math.round(speed * 2.237);
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

const accessoriesGEMFeedback_listener = new ROSLIB.Topic({
  ros: ros,
  name: "/feedback/gem_accessories",
  messageType: "joyride_interfaces/msg/AccessoriesGEMFeedback"
});

accessoriesGEMFeedback_listener.subscribe((message) => {
  updateAccessories(message);
  updateGear(message.gear_status);
});



