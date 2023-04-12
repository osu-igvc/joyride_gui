const { app, BrowserWindow, ipcMain } = require('electron');
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

var win_flag = false;
var win;
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  win = mainWindow;
  win_flag = true;
  mainWindow.maximize();
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

app.commandLine.appendSwitch("--touch-events");
app.commandLine.appendSwitch('--enable-touch-events');
app.commandLine.appendSwitch('--top-chrome-touch-ui');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const { log_listener } = require('./allDaRos.js');

fs.writeFile('./rosLogStuff.txt', '', function(err){if (err) throw err;});

function convertSecondstoTime(seconds) {
  const dateObj = new Date(seconds * 1000);
  const options = { timeZone: 'America/Chicago', hourCycle: 'h23', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const timeString = dateObj.toLocaleTimeString('en-US', options);
  return timeString;
}


let messageLabel = '';
log_listener.subscribe((message) => {
  let messageTimeStamp = message.stamp.sec;
  switch (message.level){
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
  fs.appendFile('./rosLogStuff.txt', `${convertSecondstoTime(messageTimeStamp)}> ${String(messageLabel)} ${String(message.msg)}\n`, function(err){
      if (err) throw err;
  })
  win.webContents.send('logData', `${convertSecondstoTime(messageTimeStamp)}> ${String(messageLabel)} ${String(message.msg)}\n`);
});


// let rosLaunchTest;
// ipcMain.handle('launch-ros', async (event) => {
//   rosLaunchTest = spawn("ros2", ["launch", "rosbridge_server", "rosbridge_websocket_launch.xml", "port:=9190"]);
//   let output = '';
//   rosLaunchTest.stdout.on('data', (data) => {
//     output += data;
//   });
//   rosLaunchTest.stderr.on('data', (data) => {
//     output += data;
//   });
//   await new Promise((resolve) => {
//     rosLaunchTest.on('exit', (code) => {
//       output += `rosbridge process exited with code ${code}`;
//       resolve();
//     });
//   });
//   return output;
// });

// ipcMain.handle('kill-ros', async (event) => {
//   let output = '';
//   rosLaunchTest.kill("SIGINT");
//   await new Promise((resolve) => {
//     rosLaunchTest.on('exit', (code) => {
//       output += `rosbridge process exited with code ${code}`;
//       resolve();
//     });
//   });
//   return output;
// });

// ipcMain.handle("ros-status", async (event) => {
//   if (rosLaunchTest && rosLaunchTest.exitCode === null) {
//     return true;
//   } else {
//     return false;
//   }
// });

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

function yeahItsGenocideTime() {
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
  yeahItsGenocideTime();
});




  



