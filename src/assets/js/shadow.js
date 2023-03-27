
var shadowCanvas = document.getElementById("offcanvas-2");
var shadowCanvasUtil = new bootstrap.Offcanvas(shadowCanvas);
var shadowHead = document.getElementById("shadowHead");
let numberOseconds = 5;
shadowCanvas.addEventListener('show.bs.offcanvas', function(){
    numberOseconds = 5;
    shadowHead.innerHTML = "Autonomy begins in 5";
});
setInterval(function(){
    numberOseconds--;
    shadowHead.innerHTML = "Autonomy begins in " + numberOseconds;
    if (numberOseconds <= 0){
        shadowCanvasUtil.hide();
    }
}, 1000);