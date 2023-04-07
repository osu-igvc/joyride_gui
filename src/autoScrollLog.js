const { ipcRenderer } = require("electron");
let rosOutDiv = document.getElementById("rosOutDiv");
let initialDiff = rosOutDiv.scrollHeight - rosOutDiv.scrollTop;
let rosScrolled = false;

let body = document.body;
let woah = document.createElement("img");
woah.src = "./assets/img/yeah.gif";
woah.style.position = "absolute";
body.style.position = "relative";
woah.id = "woah";
woah.width = 80;
woah.height = 80;
woah.style.top = 0;
woah.style.left = 0;
woah.style.zIndex = 100;
woah.style.transitionDuration = "0.5s";
woah.style.display = "none";
woah.style.pointerEvents = "none";
body.appendChild(woah);
let cat = document.getElementById("woah");

document.addEventListener('click', function(event) {
    if(Math.random() > 0.95){
        cat.style.display = "";
        
        setTimeout(() => {
            cat.style.top = event.clientY - 40 + "px";
            cat.style.left = event.clientX - 40 + "px";
            setTimeout(() => {
                cat.style.display = "none";
                cat.style.top = 0;
                cat.style.right = 0;
            }, 900);
        }, 200);

    }
});

  

function rosUpdateScroll(){
    if(!rosScrolled){
        rosOutDiv.scrollTop = rosOutDiv.scrollHeight;
    }
    initialDiff = rosOutDiv.scrollHeight - rosOutDiv.scrollTop;
}

rosOutDiv.onscroll = function(){
    if (rosOutDiv.scrollTop  + 1.1*initialDiff >= rosOutDiv.scrollHeight){
        rosScrolled = false;
    }
    else{
        rosScrolled = true;
    }
};
  

function colorCode(elementText){
    if (elementText.includes("[INFO]")){
        return "black";
    }
    else if (elementText.includes("[DEBUG]")){
        return "green";
    }
    else if (elementText.includes("[WARN]")){
        return "darkgoldenrod";
    }
    else if (elementText.includes("[ERROR]")){
        return "red";
    }
    return "dark-red";
}

let lines = [];
function addLogLine(message){
    lines.push(message);
    const span = document.createElement('span');
    span.textContent = message;
    span.style.color = colorCode(message);
    span.style.fontSize = "20px";
    span.style.display = "block";
    rosOutDiv.appendChild(span); 
}

window.onload = function(){
    let fs = require("fs");
    let localLines;
    rosOutDiv.innerHTML = "";
    fs.readFile("./rosLogStuff.txt", 'utf8', function(err, data){
        if (err) throw err;
        localLines = data.split("\n");
        localLines.forEach(line => {
            addLogLine(line);
        });
        rosUpdateScroll();
    });
}

ipcRenderer.on("logData", (event, message) => {
    addLogLine(message);
    rosUpdateScroll();
});



