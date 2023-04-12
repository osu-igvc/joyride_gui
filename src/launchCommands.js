let commandsDiv = document.getElementById("commandsDiv");
const { ipcRenderer } = require('electron');

function changeToKillorLaunch(button, launchName, status) {
    if (status === "kill") {
        button.style.setProperty("--color1", "var(--bs-red)");
        button.innerHTML = "Kill " + launchName;
    } else {
        button.style.setProperty("--color1", "var(--bs-success)");
        button.innerHTML = "Launch " + launchName;
    }
}
  
function createRosToggleButton(button, launchConfig, statusElement) {
    button.addEventListener("click",  async () => {
      setTimeout(async () => {
        const rosRunning = await ipcRenderer.invoke('ros-status', launchConfig.id);
  
        if (!rosRunning) {
          ipcRenderer.invoke('launch-ros', launchConfig)
            .then((output) => {
              statusElement.innerHTML = output;
            })
            .catch((error) => {
              statusElement.innerHTML = error;
            });
  
          changeToKillorLaunch(button, launchConfig.name, "kill");
        } else {
          ipcRenderer.invoke('kill-ros', launchConfig.id)
            .then((output) => {
              statusElement.innerHTML = output;
            })
            .catch((error) => {
              statusElement.innerHTML = error;
            });
  
          changeToKillorLaunch(button, launchConfig.name, "launch");
        }
      }, 1000);
    });
}

const launchConfigs = [
    {
        id: 'rosBridge',
        spawn_args: "ros2, launch, rosbridge_server, rosbridge_websocket_launch.xml, port:=9190",
        buttonId: "launch1",
        name: "ROS Bridge"
    },
    {
        id: "tileServer",
        spawn_args: "tileserver-gl, --mbtiles, ./src/stilly.mbtiles, --port, 9154",
        buttonId: "launch2",
        name: "Tile Server"
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
      changeToKillorLaunch(button, launchConfig.name, rosRunning ? 'kill' : 'launch');
    });
}

updateButtons();