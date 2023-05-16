// const { ipcRenderer } = require('electron');
const commandsDiv = document.getElementById("commandsDiv");

const launchConfigs = new Map([
    [
        "canBusLaunch",
    {
        id: 'canBus',
        spawn_args: "ros2, launch, joyride_bringup, CAN.launch.py",
        buttonId: "canBusLaunch",
        name: "CAN Bus"
    }],
    [
        "diagnosticsLaunch",
    {
        id: "diagnostics",
        spawn_args: "ros2, launch, joyride_bringup, joyride_diagnostics.launch.py",
        buttonId: "diagnosticsLaunch",
        name: "Diagnostics"
    }],
    [
        "gpsLaunch",
    {
        id: "GPS",
        spawn_args: "ros2, launch, joyride_bringup, gps_localization.launch.py",
        buttonId: "gpsLaunch",
        name: "GPS"
    }],
    [
        "localizationOdometryLaunch",
    {
        id: "localizationOdometry",
        spawn_args: "",
        buttonId: "localizationOdometryLaunch",
        name: "Localization/Odometry"
    }],
    [
        "twoDLidarLaunch",
    {
        id: "2DLidar",
        spawn_args: "ros2, launch, joyride_bringup, lidar2D.launch.py",
        buttonId: "twoDLidarLaunch",
        name: "2D Lidar"
    }],
    [
        "threeDLidarLaunch",
    {
        id: "3DLidar",
        spawn_args: "",
        buttonId: "threeDLidarLaunch",
        name: "3D Lidar"
    }],
    [
        "velocityPPLaunch",
    {
        id: "velocityPreprocessor",
        spawn_args: "",
        buttonId: "velocityPPLaunch",
        name: "Velocity Preprocessor"
    }],
    [
        "obstacleDetectionLaunch",
    {
        id: "obstacleDetection",
        spawn_args: "",
        buttonId: "obstacleDetectionLaunch",
        name: "Obstacle Detection"
    }],
    [
        "pedestrianDetectionLaunch",
    {
        id: "pedestrianDetection",
        spawn_args: "",
        buttonId: "pedestrianDetectionLaunch",
        name: "Pedestrian Detection"
    }],
    [
        "laneDetectionLaunch",
    {
        id: "laneDetection",
        spawn_args: "",
        buttonId: "laneDetectionLaunch",
        name: "Lane Detection"
    }],
    [
        "minimalPreset",
    {
        id: "minimal",
        spawn_args: "ros2, launch, joyride_bringup, joyride_minimal.launch.py",
        buttonId: "minimalPreset",
        name: "Minimal"
    }],
    [
        "joystickControlPreset",
    {
        id: "joystickControl",
        spawn_args: "ros2, launch, joyride_bringup, joyride_joystick_control.launch.py",
        buttonId: "joystickControlPreset",
        name: "Joystick Control"
    }],
    [
        "purePursuitNavigationPreset",
    {
        id: "purePursuitNavigation",
        spawn_args: "ros2, launch, joyride_bringup, joyride_pure_pursuit_navigation.launch.py",
        buttonId: "purePursuitNavigationPreset",
        name: "Pure Pursuit Navigation"
    }],
    [
        "sensorsPreset",
    {
        id: "sensors",
        spawn_args: "ros2, launch, joyride_bringup, joyride_sensors.launch.py",
        buttonId: "sensorsPreset",
        name: "Sensors"
    }],
    [
        "joystickControlSensorsPreset",
    {
        id: "joystickControlSensors",
        spawn_args: "ros2, launch, joyride_bringup, joyride_joystick_control_sensors.launch.py",
        buttonId: "joystickControlSensorsPreset",
        name: "Joystick Control + Sensors"
    }],

]);

const commandDescriptions = new Map([
    ["canBusLaunch", "Launch nodes to communicate with the CAN bus and receive data from the car"],
    ["diagnosticsLaunch", "Diagnostics"],
    ["obstacleDetectionLaunch", "Obstacle Detection"]
]);

let lastSelected = document.getElementById("canBusLaunch");
lastSelected.disabled = true;
commandsDiv.innerHTML = commandDescriptions.get(lastSelected.id);
let shutdownFlag = false;
let confirmShutdown = false;

document.getElementById("commandsTabs").addEventListener("click", function(e){
    if(shutdownFlag && e.target.id != "systemShutdownLaunch"){
        confirmShutdown = false;
        document.getElementById("systemShutdownButt").innerHTML = "Shutdown";
        document.getElementById("systemShutdownButt").style.setProperty("--color1", "var(--bs-danger)");
        document.getElementById("systemShutdownDiv").style.setProperty("display", "none");
        commandsDiv.style.removeProperty("display");

        document.getElementById("commandsButts").style.removeProperty("display");
        document.getElementById("systemShutdownButt").style.setProperty("display", "none");
    }

    if(e.target.id == "systemShutdownLaunch"){
        commandsDiv.style.setProperty("display", "none");
        document.getElementById("systemShutdownDiv").style.removeProperty("display");

        document.getElementById("commandsButts").style.setProperty("display", "none");
        document.getElementById("systemShutdownButt").style.removeProperty("display");
        shutdownFlag = true;

        e.target.disabled = true;
        lastSelected.disabled = false;
        lastSelected = e.target;
    }
    else if(e.target.classList.contains("commandsButt") && e.target.id != lastSelected.id){
        e.target.disabled = true;
        lastSelected.disabled = false;
        commandsDiv.innerHTML = commandDescriptions.get(e.target.id);
        lastSelected = e.target;
    }
})

const launchCommand = document.getElementById("launchCommandButt");
const killCommand = document.getElementById("killCommandButt");
const shutdownCommand = document.getElementById("systemShutdownButt");

launchCommand.addEventListener("click", async function(){
    const disabledButton = document.querySelector("button[disabled]");
    const disabledButtonConfig = launchConfigs.get(disabledButton.id);
    disabledButton.style.setProperty("--color1", "var(--bs-success)");
    // commandsDiv.innerHTML = `Attempting to launch ${disabledButton.innerHTML}`;
    launchCommand.disabled = true;

    const rosRunning = await ipcRenderer.invoke('ros-status', disabledButtonConfig.id);

    setTimeout(function(){
        if (!rosRunning) {
            ipcRenderer.invoke('launch-ros', disabledButtonConfig).then((output) => {
                disabledButton.style.setProperty("--color1", "var(--bs-success)");
                commandsDiv.innerHTML = output;
            }).catch((error) => {
                disabledButton.style.setProperty("--color1", "var(--bs-gray-500)");
                commandsDiv.innerHTML = error;
            });            
        } 
        launchCommand.disabled = false;
    }, 500);
});

killCommand.addEventListener("click", async function(){
    const disabledButton = document.querySelector("button[disabled]");
    const disabledButtonConfig = launchConfigs.get(disabledButton.id);
    let previousState = disabledButton.style.getPropertyValue("--color1");
    if(disabledButton.style.getPropertyValue("--color1") == "var(--bs-success)"){
        disabledButton.style.setProperty("--color1", "var(--bs-danger)");
    }
    // commandsDiv.innerHTML = `Attempting to launch ${disabledButton.innerHTML}`;
    killCommand.disabled = true;

    const rosRunning = await ipcRenderer.invoke('ros-status', disabledButtonConfig.id);
    setTimeout(function(){
        if (rosRunning) {
            ipcRenderer.invoke('kill-ros', disabledButtonConfig.id).then((output) => {
                disabledButton.style.setProperty("--color1", "var(--bs-gray-500)");
                commandsDiv.innerHTML = output;
            }).catch((error) => {
                commandsDiv.innerHTML = error;
                disabledButton.style.setProperty("--color1", previousState);
            });            
        }
        killCommand.disabled = false;
    }, 500);
});
const ROSLIB = require('roslib');
const { systemShutdownClient } = require('./allDaRos.js');
shutdownCommand.addEventListener("click", async function(){
    if(confirmShutdown){
        shutdownCommand.disabled = true;
        let request = new ROSLIB.ServiceRequest({});
    
        systemShutdownClient.callService(request, function(result) {
            ipcRenderer.invoke('nuke-start', true).then((output) => {

            }).catch((error) => {
                console.log(error);
            });
        }, function(error) {
            shutdownCommand.innerHTML = error;
            shutdownCommand.style.setProperty("--color1", "darkred");
            confirmShutdown = false;
            shutdownCommand.disabled = false;
        });
    }
    else{
        shutdownCommand.innerHTML = "Confirm Shutdown";
        shutdownCommand.style.setProperty("--color1", "#d81e05");
        confirmShutdown = true;
    }
});
  
async function updateButtons(){
    for(const [key, value] of launchConfigs){
        const button = document.getElementById(key);
        const rosRunning = await ipcRenderer.invoke('ros-status', value.id);
        button.style.setProperty("--color1", rosRunning ? "var(--bs-success)" : "var(--bs-gray-500)");
    }
}

updateButtons();