const { ipcRenderer } = require('electron');

const commandsDiv = document.getElementById("commandsDiv");

const commandDescriptions = new Map([
    ["canBusLaunch", "Launch nodes to communicate with the CAN bus and receive data from the car"],
    ["diagnosticsLaunch", "Diagnostics"],
    ["obstacleDetectionLaunch", "Obstacle Detection"]
]);

let lastSelected = document.getElementById("canBusLaunch");
lastSelected.disabled = true;
commandsDiv.innerHTML = commandDescriptions.get(lastSelected.id);
document.getElementById("commandsTabs").addEventListener("click", function(e){
    if(e.target.classList.contains("commandsButt") && e.target.id != lastSelected.id){
        e.target.disabled = true;
        lastSelected.disabled = false;
        commandsDiv.innerHTML = commandDescriptions.get(e.target.id);
        lastSelected = e.target;
    }
})

const launchCommand = document.getElementById("launchCommandButt");
const killCommand = document.getElementById("killCommandButt");

launchCommand.addEventListener("click", function(){
    const disabledButton = document.querySelector("button[disabled]");
    disabledButton.style.setProperty("--color1", "var(--bs-success)");
    // commandsDiv.innerHTML = `Attempting to launch ${disabledButton.innerHTML}`;
    launchCommand.disabled = true;
    setTimeout(function(){
        launchCommand.disabled = false;
    }, 500);
});

killCommand.addEventListener("click", function(){
    const disabledButton = document.querySelector("button[disabled]");
    disabledButton.style.setProperty("--color1", "var(--bs-danger)");
    // commandsDiv.innerHTML = `Attempting to kill ${disabledButton.innerHTML}`;
    killCommand.disabled = true;
    setTimeout(function(){
        disabledButton.style.setProperty("--color1", "var(--bs-gray-500)");
        killCommand.disabled = false;
    }, 500);
});

function changeButtonDisplayStatus(button, launchName, status) {
    if (status === "kill") {
        button.style.setProperty("--color1", "var(--bs-red)");
        // button.innerHTML = "Kill " + launchName;
    } 
    else if (status === "Launch") {
        button.style.setProperty("--color1", "var(--bs-success)");
        // button.innerHTML = "Launch " + launchName;
    }
    else if (status === "Nothing") {
        button.style.setProperty("--color1", "var(--bs-gray-500)");
        // button.innerHTML = launchName;
    }
    else{
      button.style.setProperty("--color1", "var(--bs-warning)");
      button.innerHTML = "ERROR";
      setTimeout(() => {
        button.style.setProperty("--color1", "var(--bs-gray-500)");
        button.innerHTML = launchName;
      }, 1000);
    }
}
  
// function createRosToggleButton(button, launchConfig, statusElement) {
//     button.addEventListener("click",  async () => {
//         // button.style.setProperty("pointer-events", "none");
//         button.disabled = true;
//       setTimeout(async () => {
//         const rosRunning = await ipcRenderer.invoke('ros-status', launchConfig.id);
  
//         if (!rosRunning) {
//           ipcRenderer.invoke('launch-ros', launchConfig)
//             .then((output) => {
//               changeButtonDisplayStatus(button, launchConfig.name, "kill");
//               statusElement.innerHTML = output;
//             })
//             .catch((error) => {
//               statusElement.innerHTML = error;
//             });
  
          
//         } else {
//           ipcRenderer.invoke('kill-ros', launchConfig.id)
//             .then((output) => {
//               statusElement.innerHTML = output;
//             })
//             .catch((error) => {
//               statusElement.innerHTML = error;
//             });
  
//           changeToKillorLaunch(button, launchConfig.name, "launch");
//         }
//         // button.style.setProperty("pointer-events", "auto");
//         button.disabled = false;
//       }, 1000);
//     });
// }

const { app } = require('@electron/remote');
const path = require('path');


const launchConfigs = [
    {
        id: 'canBus',
        spawn_args: "",
        buttonId: "canBusLaunch",
        name: "CAN Bus"
    },
    {
        id: "diagnostics",
        spawn_args: "",
        buttonId: "diagnosticsLaunch",
        name: "Diagnostics"
    },
    {
        id: "GPS",
        spawn_args: "",
        buttonId: "gypsyLaunch",
        name: "GPS"
    },
    {
        id: "LocalizationOdometry",
        spawn_args: "",
        buttonId: "localizationOdometryLaunch",
        name: "Localization/Odometry"
    }
];

launchConfigs.forEach((launchConfig) => {
    const button = document.getElementById(launchConfig.buttonId);
    createRosToggleButton(button, launchConfig, commandsDiv);
});
  
async function updateButtons(){
    launchConfigs.forEach(async (launchConfig) => {
      const button = document.getElementById(launchConfig.buttonId);
      const rosRunning = await ipcRenderer.invoke('ros-status', launchConfig.id);
      changeButtonDisplayStatus(button, launchConfig.name, rosRunning ? 'kill' : 'Launch');
    });
}

updateButtons();