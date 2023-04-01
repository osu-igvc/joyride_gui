document.getElementById("navTime").innerHTML = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

// Icon stuffs

// let leftBlinkerIntervalId = null;
// function leftBlinkerOn(){
//   let blinkerSVG = document.getElementById("leftBlinker");
//   leftBlinkerIntervalId = setInterval(function(){
//     blinkerSVG.style.backgroundColor = 'var(--bs-success)';
//     setTimeout(function(){
//       blinkerSVG.style.backgroundColor = 'var(--bs-secondary)';
//     }, 500);
//   }, 1000);
  
//   // return the interval ID for later use
//   return leftBlinkerIntervalId;
// }

// let rightBlinderIntervalId = null;
// function rightBlinkerOn(){
//   let blinkerSVG = document.getElementById("rightBlinker");
//   rightBlinderIntervalId = setInterval(function(){
//     blinkerSVG.style.backgroundColor = 'var(--bs-success)';
//     setTimeout(function(){
//       blinkerSVG.style.backgroundColor = 'var(--bs-secondary)';
//     }, 500);
//   }, 1000);

//   return rightBlinderIntervalId;
// }
let leftBlinker = false;
let rightBlinker = false;
setInterval(function(){
    if(leftBlinker){
        let blinkerSVG = document.getElementById("leftBlinkerIcon");
        blinkerSVG.style.backgroundColor = 'var(--bs-success)';
        setTimeout(function(){
            blinkerSVG.style.backgroundColor = 'var(--bs-secondary)';
        }, 500);
    }
    if(rightBlinker){
        let blinkerSVG = document.getElementById("rightBlinkerIcon");
        blinkerSVG.style.backgroundColor = 'var(--bs-success)';
        setTimeout(function(){
            blinkerSVG.style.backgroundColor = 'var(--bs-secondary)';
        }, 500);
    }
}, 1000);

function headlightsOnOff(isHeadlights){
  document.getElementById("headlightsDiv").style.backgroundColor = isHeadlights ? 'var(--bs-warning)' : 'var(--bs-secondary)';
}

function highBeamsOnOff(isHighBeams){
  document.getElementById("highbeamsDiv").style.backgroundColor = isHighBeams ? 'var(--bs-blue)' : 'var(--bs-secondary)';
}

function seatbeltOnOff(isSeatbelt){
  document.getElementById("seatBeltIcon").style.backgroundColor = isSeatbelt ? 'var(--bs-green)' : 'var(--bs-red)';
}

function heatedSeatsOnOff(){
  document.getElementById("heatedSeatsIcon").style.backgroundColor = 'var(--bs-orange';
}
setInterval(function(){
  document.getElementById("navTime").innerHTML = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  if(document.getElementById("navTime").innerHTML.includes("4:20")){
    document.getElementById("navTime").style.backgroundColor = "var(--bs-green)";
    document.getElementById("navTime").innerHTML = "WEED NUMBER!!!!";
  }
}, 1000);




seatbeltOnOff(false);
heatedSeatsOnOff();

function updateAccessories(message){
  headlightsOnOff(message.headlights_on);
  highBeamsOnOff(message.highbeams_on);
  seatbeltOnOff(message.driver_seatbelt_on);
  leftBlinker = message.left_turn_signal_on;
  rightBlinker = message.right_turn_signal_on;
}