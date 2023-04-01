const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const ROSLIB = require('roslib');
const { spawn } = require('child_process');
// // See the Electron documentation for details on how to use preload scripts:
// // https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// let isRos = true;

// const command = 'ros2';
// const args = ['launch', 'rosbridge_server', 'rosbridge_websocket_launch.xml', 'port:=9190'];

// // Spawn the child process
// rosServer = spawn(command, args);

// const logCommand = 'ros2';
// const logArgs = ['launch', 'turtlesim', 'multisim.launch.py'];

// loggingDemo = spawn(logCommand, logArgs);


// while(isRos){
const ros = new ROSLIB.Ros({ url: "ws://localhost:9190" });
//   time.sleep(1);
//   ros.on('connection', function() {
//     isRos = false;
//   });
//   ros.on('error', function(error) {
//     console.log(error);
//   });
// }

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
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

// app.on('before-quit', () => {
//   rosServer.kill('SIGKILL');
//   loggingDemo.kill('SIGKILL');
// });

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});




// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const log_listener = new ROSLIB.Topic({
  ros: ros,
  name: "/rosout",
  messageType: "rcl_interfaces/msg/Log"
});

// fs.appendFile('./rosLogStuff.txt', "WHAT UP BROTHER\n", function(err){
//   if (err) throw err;
//   console.log("yeeet");
// });


// const steeringAngle_listener = new ROSLIB.Topic({
//   ros: ros,
//   name: "/feedback/steer_angle",
//   messageType: "std_msgs/msg/Float32"
// });

// const steeringTorque_listener = new ROSLIB.Topic({
//   ros: ros,
//   name: "/feedback/steering_torque",
//   messageType: "std_msgs/msg/Float32"
// });

// const wheelSpeed_listener = new ROSLIB.Topic({
//   ros: ros,
//   name: "/feedback/wheelspeed",
//   messageType: "std_msgs/msg/Float32"
// });

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


  // var speedStuff = [];
  // var steeringStuff = [];

  // steeringAngle_listener.subscribe((message) => {
  //     // steeringAngle = String(message.data);
  //     // updateCSV();
  //     steeringStuff.push(message.data);
  //     // win.webContents.send('ping', steeringStuff);
  // });

  // wheelSpeed_listener.subscribe((message) => {
  //     // speed = String(message.data);
  //     // updateCSV();
  //     speedStuff.push(message.data);
  //     // win.webContents.send('logData', speedStuff);
  // });


  



