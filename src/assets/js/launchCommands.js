let cbt = document.getElementById("launchCBT");
let commandsDiv = document.getElementById("commandsDiv");
let cbtrue = false;
cbt.onclick = () => {
    commandsDiv.innerHTML = !cbtrue ? "Launching CBT..." : "Killing CBT...";
    setTimeout(() => {
        if(!cbtrue){
            cbt.style.setProperty("--color1", "var(--bs-red)");
            cbt.innerHTML = "Kill CBT";
            cbtrue = true;
        }
        else{
            cbt.style.setProperty("--color1", "var(--bs-success)");
            cbt.innerHTML = "Launch CBT";
            cbtrue = false;
        }
    }, 1000);
}