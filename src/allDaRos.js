const ROSLIB = require('roslib');

const ros = new ROSLIB.Ros({ url: "ws://localhost:9190" });

const accessoriesGEMFeedback_listener = new ROSLIB.Topic({
    ros: ros,
    name: "/feedback/gem_accessories",
    messageType: "joyride_interfaces/msg/AccessoriesGEMFeedback"
});

const log_listener = new ROSLIB.Topic({
    ros: ros,
    name: "/rosout",
    messageType: "rcl_interfaces/msg/Log"
});

const steeringAngle_listener = new ROSLIB.Topic({
    ros: ros,
    name: "/feedback/steer_angle",
    messageType: "joyride_interfaces/msg/EPSPositionVelocityFeedback"
});

const wheelSpeed_listener = new ROSLIB.Topic({
    ros: ros,
    name: "/feedback/wheelspeed",
    messageType: "std_msgs/msg/Float32"
});

const diagnosticMessages_listener = new ROSLIB.Topic({
    ros: ros,
    name: "/diagnostics_agg",
    messageType: "diagnostic_msgs/DiagnosticArray"
});

const driveByWire_listener = new ROSLIB.Topic({
    ros: ros,
    name: "/status/dbw_accessory_controller",
    messageType: "joyride_interfaces/msg/DriveByWireSystemInfo"
});

module.exports = {
    accessoriesGEMFeedback_listener: accessoriesGEMFeedback_listener,
    ros: ros,
    log_listener: log_listener,
    steeringAngle_listener: steeringAngle_listener,
    wheelSpeed_listener: wheelSpeed_listener,
    diagnosticMessages_listener: diagnosticMessages_listener,
    driveByWire_listener: driveByWire_listener
}


