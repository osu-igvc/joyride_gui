// const fs = require('fs');
// const ROSLIB = require('roslib');
// const ros = new ROSLIB.Ros({ url: "ws://localhost:9090" });

// const log_listener = new ROSLIB.Topic({
//     ros: ros,
//     name: "/rosout",
//     messageType: "rcl_interfaces/msg/Log"
// });

// fs.appendFile('./rosLogStuff.txt', "WHAT UP BROTHER\n", function(err){
//     if (err) throw err;
//     console.log("yeeet");
// });


// const steeringAngle_listener = new ROSLIB.Topic({
//     ros: ros,
//     name: "/feedback/steer_angle",
//     messageType: "std_msgs/msg/Float32"
// });
  
// const steeringTorque_listener = new ROSLIB.Topic({
//     ros: ros,
//     name: "/feedback/steering_torque",
//     messageType: "std_msgs/msg/Float32"
// });

// const wheelSpeed_listener = new ROSLIB.Topic({
//     ros: ros,
//     name: "/feedback/wheelspeed",
//     messageType: "std_msgs/msg/Float32"
// });


// let speed = "";
// let steeringAngle = "";
// let steeringTorque = "";


// function saveLineCSV(){
//     const csv = `${speed}, ${steeringAngle}, ${steeringTorque}\n`;
//     try{
//         fs.appendFile("./metricsLog.txt", csv);
//     } catch(err){
//         console.error(err);
//     }
// }


// function updateCSV(){
//     if(speed != "" && steeringAngle != ""){
//         saveLineCSV();
//         speed = "";
//         steeringAngle = "";
//     }
// }
