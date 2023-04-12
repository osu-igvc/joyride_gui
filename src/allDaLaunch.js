// const killProcess = async (process) => {
//     process.kill('SIGINT');
//     await new Promise((resolve) => {
//       process.on('exit', (code) => {
//         console.log(`Process exited with code ${code}`);
//         resolve();
//       });
//     });
//   };
  
// const launchProcess = async (command, args) => {
//     const process = spawn(command, args);

//     return new Promise((resolve, reject) => {
//         process.stdout.on('data', (data) => {
//         console.log(`Process stdout: ${data}`);
//         });

//         process.stderr.on('data', (data) => {
//         console.log(`Process stderr: ${data}`);
//         });

//         process.on('exit', (code, signal) => {
//         console.log(`Process exited with code ${code} and signal ${signal}`);
//         if (code === 0) {
//             resolve('Process exited cleanly');
//         } else {
//             reject(new Error(`Process exited with code ${code} and signal ${signal}`));
//         }
//         });
//     });
// };
  
// module.exports = {
//     launchProcess,
//     killProcess
// };
  