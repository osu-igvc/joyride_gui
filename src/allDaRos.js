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

const expectedStuffs_listener = new ROSLIB.Topic({
    ros: ros,
    name: "/cmd_ack",
    messageType: "ackermann_msgs/AckermannDriveStamped"
});

const wheelSpeed_listener = new ROSLIB.Topic({
    ros: ros,
    name: "/feedback/wheelspeed",
    messageType: "std_msgs/msg/Float32"
});

const head_listener = new ROSLIB.Topic({
    ros: ros,
    name: "/odom",
    messageType: "nav_msgs/msg/Odometry"
});

const diagnosticMessages_listener = new ROSLIB.Topic({
    ros: ros,
    name: "/diagnostics_agg",
    messageType: "diagnostic_msgs/DiagnosticArray"
});

const driveByWire_listener = new ROSLIB.Topic({
    ros: ros,
    name: "/feedback/dbw_system_info",
    messageType: "joyride_interfaces/msg/DriveByWireSystemInfo"
});

// Map stuff
const transformedCoords_publisher = new ROSLIB.Topic({
    ros: ros,
    name: '/goal_pose',
    messageType: 'geometry_msgs/PoseStamped'
  });

const transformCoordsClient = new ROSLIB.Service({
    ros: ros,
    name: '/fromLL',
    serviceType: 'robot_localization/FromLL'
  });

const plannedPath_listener = new ROSLIB.Topic({
    ros: ros,
    name: '/plan',
    messageType: 'nav_msgs/msg/Path'
});

const transformToLLClient = new ROSLIB.Service({
    ros: ros,
    name: '/toLL',
    serviceType: 'robot_localization/ToLL'
  });

const getInitialLLClient = new ROSLIB.Service({
    ros: ros,
    name: '/getInitialLL',
    serviceType: 'joyride_interfaces/srv/GetOdomOriginLL'
});

// Automode stuff
const automodeClient = new ROSLIB.Service({
    ros: ros,
    name: '/requestAutoEnableDisable',
    serviceType: 'joyride_interfaces/srv/RequestAutoEnableDisable'
});

const navSatFix_listener = new ROSLIB.Topic({
    ros: ros,
    name: "/vectornav/gnss",
    messageType: "sensor_msgs/NavSatFix"
});

const gps_listener = new ROSLIB.Topic({
    ros: ros,
    name: "/vectornav/raw/gps",
    messageType: "joyride_sensors/vectornav/vectornav_msgs/msg/GpsGroup"
});

const rawCameraStream_listener = new ROSLIB.Topic({
    ros: ros,
    name: "/sensors/cameras/center/image/compressed",
    messageType: "sensor_msgs/CompressedImage"
});

const laneTrackingStream_listener = new ROSLIB.Topic({
    ros: ros,
    name: "/sensors/cameras/lane/image_raw",
    messageType: "sensor_msgs/CompressedImage"
});

const pedestrianDetectionStream_listener = new ROSLIB.Topic({
    ros: ros,
    name: "/sensors/cameras/pedestrian/image_raw",
    messageType: "sensor_msgs/CompressedImage"
});

const systemShutdownClient = new ROSLIB.Service({
    ros: ros,
    name: '/nuke',
    serviceType: 'std_srvs/srv/Trigger'
});



module.exports = {
    accessoriesGEMFeedback_listener: accessoriesGEMFeedback_listener,
    ros: ros,
    log_listener: log_listener,
    steeringAngle_listener: steeringAngle_listener,
    wheelSpeed_listener: wheelSpeed_listener,
    diagnosticMessages_listener: diagnosticMessages_listener,
    driveByWire_listener: driveByWire_listener,
    transformedCoords_publisher: transformedCoords_publisher,
    transformCoordsClient: transformCoordsClient,
    automodeClient: automodeClient,
    navSatFix_listener: navSatFix_listener,
    gps_listener: gps_listener,
    rawCameraStream_listener: rawCameraStream_listener,
    expectedStuffs_listener: expectedStuffs_listener,
    plannedPath_listener: plannedPath_listener,
    transformToLLClient: transformToLLClient,
    head_listener: head_listener,
    systemShutdownClient: systemShutdownClient,
    laneTrackingStream_listener: laneTrackingStream_listener,
    pedestrianDetectionStream_listener: pedestrianDetectionStream_listener,
    getInitialLLClient: getInitialLLClient
}


