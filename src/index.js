const { app, BrowserWindow, ipcMain } = require('electron');
const { initialize, enable } = require('@electron/remote/main');
app.commandLine.appendSwitch('disable-pinch');
initialize();
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);

  // Handle the error as appropriate, e.g. show an error dialog
});

if (require('electron-squirrel-startup')) {
  app.quit();
}

let win;
let developerWindow;
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const backgroundWindow = new BrowserWindow({
    parent: mainWindow,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  enable(mainWindow.webContents)
  mainWindow.webContents.setAudioMuted(true);
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.setZoomFactor(1);
  });
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  backgroundWindow.loadFile(path.join(__dirname, 'background.html'));
  win = mainWindow;
  developerWindow = backgroundWindow;
  win_flag = true;

};

app.commandLine.appendSwitch("--touch-events");
app.commandLine.appendSwitch('--enable-touch-events');
app.commandLine.appendSwitch('--top-chrome-touch-ui');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Clear local storage on startup
const { localStorage } = require('electron-browser-storage');
app.on('ready', () => {
  localStorage.removeItem('currentDestinationLayer');
  localStorage.removeItem('markers');
  localStorage.removeItem('pathTraveledData');
  localStorage.removeItem('plannedPathData');
});

const { log_listener } = require('./allDaRos.js');

fs.writeFile('./rosLogStuff.txt', '', function(err){if (err) throw err;});

function convertSecondstoTime(seconds) {
  const dateObj = new Date(seconds * 1000);
  const options = { timeZone: 'America/Chicago', hourCycle: 'h23', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const timeString = dateObj.toLocaleTimeString('en-US', options);
  return timeString;
}

const rosbridge = spawn("ros2", ["launch", "rosbridge_server", "rosbridge_websocket_launch.xml", "port:=9190"]);
const tileServer = spawn("tileserver-gl", ["--mbtiles", "./src/rochesty.mbtiles", "--port", "9154"]);
tileServer.stderr.on('data', function(data) {
  console.log('stderr: ' + data);
})
let waitUntil = new Date(new Date().getTime() + 1.5 * 1000);
while(waitUntil > new Date()){}

log_listener.subscribe((message) => {
  const messageTimeStamp = message.stamp.sec;
  let messageLabel;

  switch (message.level) {
    case 20:
      messageLabel = '[INFO]';
      break;
    case 30:
      messageLabel = '[WARN]';
      break;
    case 40:
      messageLabel = '[ERROR]';
      break;
    case 50:
      messageLabel = '[FATAL]';
      break;
    default:
      messageLabel = '[DEBUG]';
  }

  const logMessage = `${convertSecondstoTime(messageTimeStamp)}> ${messageLabel} ${message.msg}\n`;

  fs.appendFile('./rosLogStuff.txt', logMessage, function(err) {
    if (err) throw err;
  });

  if(!message.msg.includes("position")){
    win.webContents.send('logData', logMessage);
  }
});

// Launch stuffs
const rosProcesses = {};

ipcMain.handle('launch-ros', async (event, launchConfig) => {
  const { id, spawn_args } = launchConfig;
  let args_list = spawn_args.split(", ");
  let command = args_list.shift();
  const rosLaunch = spawn(command, args_list);

  rosLaunch.on('error', (error) => {
    console.error(`Error in ROS process ${id}:`, error);
  });

  rosLaunch.on('close', (code, signal) => {
    delete rosProcesses[id];
  });

  rosProcesses[id] = rosLaunch;
  let output = '';
  rosLaunch.stdout.on('data', (data) => {
    output += data;
  });
  rosLaunch.stderr.on('data', (data) => {
    output += "stderr:"
    output += data;
  });
  await new Promise((resolve) => {
    rosLaunch.on('exit', (code) => {
      output += `Process exited with code ${code}`;
      resolve();
    });
  });
  return output;
});

ipcMain.handle('kill-ros', async (event, id) => {
  const rosLaunch = rosProcesses[id];
  if (rosLaunch) {
    let output = '';
    try {
      rosLaunch.kill("SIGINT");
    } catch (error) {
      console.error(`Error while killing ROS process ${id}:`, error);
    }
    await new Promise((resolve) => {
      rosLaunch.on('exit', (code) => {
        output += `Process exited with code ${code}`;
        resolve();
      });
    });
    return output;
  }
});

ipcMain.handle("ros-status", async (event, id) => {
  const rosLaunch = rosProcesses[id];
  if (rosLaunch && rosLaunch.exitCode === null) {
    return true;
  } else {
    return false;
  }
});

const ROSLIB = require('roslib');
const { systemShutdownClient } = require('./allDaRos.js');

let nukeSystemStartTime = null;
let nukeCountdown = null;
let nukeIntervalFlag = false;
ipcMain.handle("toggle-nuke", async (event, toggle) => {
  if(nukeSystemStartTime === null && toggle === "start") {
    nukeSystemStartTime = new Date().getTime();
    nukeIntervalFlag = true;
  }
  if(toggle === "stop") {
    clearInterval(nukeCountdown);
    nukeSystemStartTime = null;
    nukeIntervalFlag = false;
  }

  if(nukeIntervalFlag){
    nukeCountdown = setInterval(() => {
      const timeElapsed = Math.round(15 - (new Date().getTime() - nukeSystemStartTime) / 1000);
      if(timeElapsed <= 0) {
        systemShutdownClient.callService(new ROSLIB.ServiceRequest({}), function(result) {
          win.webContents.send('nuke-time', "Goodbye");
          console.log('Result for service call on ' + systemShutdownClient.name + ': ' + result.success);
          spawn("systemctl", ["poweroff"]);
        }, function(error) {
          win.webContents.send('nuke-time', error);
        });
      }
      else{
        win.webContents.send('nuke-time', timeElapsed);
      }
    }, 1000);
  }
});



function killAllSpawn() {
  for (const id in rosProcesses) {
    const rosProcess = rosProcesses[id];
    if (rosProcess && rosProcess.exitCode === null) {
      try {
        rosProcess.kill('SIGINT');
      } catch (error) {
        console.error(`Error while killing ROS process ${id}:`, error);
      }
    }
  }
}

app.on('before-quit', () => {
  killAllSpawn();
  try {
    rosbridge.kill('SIGINT');
    tileServer.kill('SIGINT');
  } catch (error) {
    console.error(error);
  }
});

// Music stuff
let musicQueue = [];
function loadSongs(){
    const musicDir = path.join(__dirname, '/assets/music');
    fs.readdir(musicDir, (err, files) => {
        if(err){
            console.log(err);
        } else {
            files.forEach(file => {
                if(file.endsWith('.mp3')){
                    musicQueue.push(file);
                }
            });
        }
    });
}
function shuffleQueue(){
  for(let i = musicQueue.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * i);
      const temp = musicQueue[i];
      musicQueue[i] = musicQueue[j];
      musicQueue[j] = temp;
  }
}

function playNextSong(){
  if(musicQueue.length > 0){
      let song = musicQueue.shift();
      developerWindow.webContents.send('play-song', `./assets/music/${song}`);
  }
}

loadSongs();

setTimeout(() => {
  shuffleQueue();
  playNextSong();
}, 250);

ipcMain.handle('get-current-audio-state', async (event) => {
  const backgroundState = new Promise((resolve) => {
    developerWindow.webContents.send('get-current-audio-state');
    ipcMain.once('current-audio-state', (event, state) => {
      resolve(state);
    });
  });
  return backgroundState;
});

ipcMain.handle('get-queue', async (event) => {
  return musicQueue;
});

// ipcMain.handle('remove-song', async (event, song) => {
//   const index = musicQueue.indexOf(song);
//   if(index > -1){
//       musicQueue.splice(index, 1);
//   }
// });

ipcMain.handle('move-song-to-position', async (event, song, position) => {
  const index = musicQueue.indexOf(song);
  if(index > -1){
      musicQueue.splice(index, 1);
      musicQueue.splice(position, 0, song);
  }
});

// ipcMain.handle('is-playing', async (event) => {
//   return new Promise((resolve) => {
//     developerWindow.webContents.send('is-playing');
//     ipcMain.once('is-playing', (event, isPlaying) => {
//       resolve(isPlaying);
//     });
//   });
// });


ipcMain.handle('play-song', async (event, song) => {
  developerWindow.webContents.send('play-song', song);
});

ipcMain.handle('remove-song', async (event, song) => {
  musicQueue = musicQueue.filter((s) => s !== song);
});

ipcMain.handle('stop-song', async (event) => {
  developerWindow.webContents.send('stop-song');
});

ipcMain.handle('volume', async (event, volume) => {
  developerWindow.webContents.send('volume', volume);
});

ipcMain.handle("seeked", async (event, time) => {
  developerWindow.webContents.send("seeked", time);
});

ipcMain.handle("mute", async (event, mute) => {
  developerWindow.webContents.send("mute", mute);
});

ipcMain.handle("resume", async (event) => {
  developerWindow.webContents.send("resume");
});

ipcMain.handle("song-ended", async (event) => {
  playNextSong();
});

// Goal pose stuffs
// const { transformedCoords_publisher, goalReached_listener } = require('./allDaRos.js');
// let goalPoseArray = [];
// ipcMain.handle("goal-poses", (event, goalPoses) => {
//   goalPoseArray = goalPoses;
//   console.log(goalPoseArray);
//   goalPoseArray.forEach((goalPose) => {
//     console.log(JSON.stringify(goalPose, null, 2));
//   });
//   sendNextGoalPose();
// });

// goalReached_listener.subscribe((message) => {
//   if(message.data === "Goal Reached"){
//     sendNextGoalPose();
//   }
// });

// function sendNextGoalPose(){
//   if(goalPoseArray.length > 0){
//     const goalPose = goalPoseArray.shift();
//     console.log("sending goal pose " + JSON.stringify(goalPose, null, 2));
//     transformedCoords_publisher.publish(goalPose);
//   }
// }

