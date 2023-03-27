const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const ROSLIB = require('roslib');
// // See the Electron documentation for details on how to use preload scripts:
// // https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

var rosServer;
var mapServer;
var webVideoServer;
const { spawn } = require('child_process');

function startServers(){
  console.log("yo");
  const mapCommand = 'npm';
  const mapArgs = ['run', 'tileserver'];
  mapServer = spawn(mapCommand, mapArgs);
  // Define the command to execute and its arguments
  const command = 'ros2';
  const args = ['launch', 'rosbridge_server', 'rosbridge_websocket_launch.xml', 'port:=9190'];

  // Spawn the child process
  rosServer = spawn(command, args);

  const webCommand = 'bash';
  const webArgs = ['-c', '. install/setup.bash; ros2 run web_video_server web_video_server port:=8181'];
  webVideoServer = spawn(webCommand, webArgs);
  server_flag = false;



  rosServer.on('error', (err) => {
    console.error(`Failed to execute '${command} ${args.join(' ')}': ${err}`);
  });

  // Log the output from the child process
  rosServer.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  // Log any errors from the child process
  rosServer.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Log when the child process exits
  rosServer.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
  });

  webVideoServer.on('error', (err) => {
    console.error(`Failed to execute '${command} ${args.join(' ')}': ${err}`);
  });

  // Log the output from the child process
  webVideoServer.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  // Log any errors from the child process
  webVideoServer.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Log when the child process exits
  webVideoServer.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
  });

  mapServer.on('spawn', () => {
    console.log('spawned');
  });

  mapServer.on('error', (err) => {
    console.error(`Failed to execute '${command} ${args.join(' ')}': ${err}`);
  });

  // Log the output from the child process
  mapServer.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  // Log any errors from the child process
  mapServer.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Log when the child process exits
  mapServer.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
  });

}

app.on('ready', startServers);
// Oh yeah, it's genocide time
function cleanup() {
  console.log("killing rosServer");
  rosServer.kill('SIGINT');
  console.log("killing webVideoServer");
  webVideoServer.kill('SIGINT');

  console.log("killing mapServer");
  mapServer.kill('SIGINT');
  // Quit the app
  setTimeout(() =>{
    app.quit();
  }, 8000);
}


app.on('window-all-closed', () => {
  // Ignore this event on macOS
  if (process.platform !== 'darwin') {
    // Clean up before quitting
    cleanup();
  }
});


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
// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


const ros = new ROSLIB.Ros({ url: "ws://localhost:9190" });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const log_listener = new ROSLIB.Topic({
  ros: ros,
  name: "/rosout",
  messageType: "rcl_interfaces/msg/Log"
});
console.log("sah");
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

function convertSecondstoTime(seconds){
  dateObj = new Date(seconds * 1000);
  hours = dateObj.getUTCHours() + 6;
  minutes = dateObj.getUTCMinutes();
  seconds = dateObj.getUTCSeconds();

  timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  return timeString;
}

let messageLabel = '';
log_listener.subscribe((message) => {
  let messageTimeStamp = message.stamp.sec;
  console.log("hi");
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



