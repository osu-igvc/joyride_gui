
let batt = document.getElementById("batteryLevel");
let battLevelValue = document.getElementById("batteryLevelValue");

function bt(num, lower, upper){
    return num > lower && num <= upper;
}

function changeBattery(battValue){
    battLevelValue.innerHTML = battValue + "%"
    if (battValue <= 5 && batt.src != "./assets/img/Battery/battery-0.svg"){
        batt.src = "./assets/img/Battery/battery-0.svg";
    }
    else if (bt(battValue, 5, 25) && batt.src != "./assets/img/Battery/battery-25.svg"){
        batt.src = "./assets/img/Battery/battery-25.svg";
    }
    else if (bt(battValue, 25, 50) && batt.src != "./assets/img/Battery/battery-50.svg"){
        batt.src = "./assets/img/Battery/battery-50.svg";
    }
    else if (bt(battValue, 50, 75) && batt.src != "./assets/img/Battery/battery-75.svg"){
        batt.src = "./assets/img/Battery/battery-75.svg";
    }
    else if (battValue > 75 && batt.src != "./assets/img/Battery/battery-100.svg"){
        batt.src = "./assets/img/Battery/battery-100.svg";
    }
}

let rev = -1;
let batteryCounter = 100;
setInterval(function(){
    if (batteryCounter >= 100 || batteryCounter <= 0){
        rev = rev * -1;
    }
    batteryCounter -= 1 * rev;
    changeBattery(batteryCounter)
}, 250);