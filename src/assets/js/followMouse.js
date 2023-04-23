
const compass = document.getElementById("compassDiv");
const poles = document.getElementById("poleCenter");


function round(number, increment){
    return Math.round((number) / increment) * increment;
}


// let currentAngle = 0
let rotate = 0;
compass.addEventListener('touchmove', (event) => {
    const x = poles.getBoundingClientRect().left + poles.clientWidth/2;
    const y = poles.getBoundingClientRect().top + poles.clientHeight/2;
    const touch = event.touches[0];
    const radian = Math.atan2(-touch.pageX + x, -touch.pageY + y);
    rotate = radian * (180 / Math.PI) * -1;
    poles.style.transform = `rotate(${round(rotate, 15)}deg)`;
    if(round(rotate, 15) <= 90 && round(rotate, 15) >= -180){
        rotate = Math.abs(round(rotate, 15) - 90);
    }
    else if(round(rotate, 15) > 90 && round(rotate, 15) <= 180){
        rotate = 360 + 90 - round(rotate, 15);
    }
    // rotate = rotate == 90 ? 270 : rotate;
    document.getElementById('heading').innerHTML = `  ${rotate}°`

});


let isMouseDown = false;

compass.addEventListener('mousedown', (event) => {
    isMouseDown = true;
});

compass.addEventListener('mouseup', (event) => {
    isMouseDown = false;
});

compass.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
        const x = poles.getBoundingClientRect().left + poles.clientWidth/2;
        const y = poles.getBoundingClientRect().top + poles.clientHeight/2;
        const radian = Math.atan2(-event.pageX + x, -event.pageY + y);
        rotate = radian * (180 / Math.PI) * -1;

        poles.style.transform = `rotate(${round(rotate, 15)}deg)`;
        if(round(rotate, 15) <= 90 && round(rotate, 15) >= -180){
            rotate = Math.abs(round(rotate, 15) - 90);
        }
        else if(round(rotate, 15) > 90 && round(rotate, 15) <= 180){
            rotate = 360 + 90 - round(rotate, 15);
        }
        // rotate = rotate == 90 ? 270 : rotate;
        document.getElementById('heading').innerHTML = `  ${rotate}°`;
    }
});


// setInterval(function(){console.log(rot)}, 2000);