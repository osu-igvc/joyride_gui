var myOffcanvas = document.getElementById('offcanvas-1');
var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
let isVisible = false;

myOffcanvas.addEventListener('shown.bs.offcanvas', function (){
    isVisible = true;
});

myOffcanvas.addEventListener('hidden.bs.offcanvas', function(){
    isVisible = false;
});

document.getElementById("mainrow").onclick = function(){
    if (isVisible){
        bsOffcanvas.hide();
    }
}