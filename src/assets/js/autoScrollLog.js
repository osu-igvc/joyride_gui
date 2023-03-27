let logTextDiv = document.getElementById("textBrowserDiv");
let initialDiff = logTextDiv.scrollHeight - logTextDiv.scrollTop;
let scrolled = false;

function updateScroll(){
    if(!scrolled){
        logTextDiv.scrollTop = logTextDiv.scrollHeight;
    }
}

logTextDiv.onscroll = function(){
    if (logTextDiv.scrollTop + 0.1*initialDiff >= logTextDiv.scrollHeight - initialDiff ){
        scrolled = false;
    }
    else{
        scrolled = true;
    }
};

// function br(){
//     return document.createElement('br');
// }
// function addLine(text){
//     return document.createTextNode(text);
// }
function colorCode(elementText){
    if (elementText.includes("[INFO]")){
        return "color:black";
    }
    else if (elementText.includes("[DEBUG]")){
        return "color:green";
    }
    else if (elementText.includes("[WARN]")){
        return "color:darkgoldenrod";
    }
    else if (elementText.includes("[ERROR]")){
        return "color:red";
    }
    return "color:dark-red";
}
window.onload = function(){
    let fs = require("fs");
    let lines;
    let elementStyle;
    logTextDiv.innerHTML = "";
    fs.readFile("./rosLogStuff.txt", 'utf8', function(err, data){
        if (err) throw err;
        lines = data.split("\n");
        lines.forEach(element => {
            elementStyle = colorCode(element) + ";font-size: 20px";
            logTextDiv.innerHTML += `<p style="${elementStyle}">${element}</p>`
            
        });
        updateScroll();
    });
}



require('electron').ipcRenderer.on('logData', (event, message) => {
    console.log('hi');
    logTextDiv.innerHTML += `<p style=${colorCode(message)}>${message}</p>`
    updateScroll();
})

