function logName(event){
    rosOutDiv.innerHTML += `<p class="logText">${event.target.innerHTML}</p>`
    rosUpdateScroll();
}


let rowCount = 0;
document.getElementById("status").onclick = () => {
    rowCount++;
    createNewRow("table3Body", `Sensor ${rowCount}`, `Message ${rowCount}`);
}