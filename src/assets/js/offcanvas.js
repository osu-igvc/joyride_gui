var myOffcanvas = document.getElementById('offcanvas-1');
var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
let isVisible = false;

myOffcanvas.addEventListener('shown.bs.offcanvas', function (){
    isVisible = true;
});

myOffcanvas.addEventListener('hidden.bs.offcanvas', function(){
    isVisible = false;
});

// let confirmCanv = new bootstrap.Offcanvas(document.getElementById("confirmOffCanvas"));
// confirmCanv.show();
document.getElementById("tabOInfuriation").addEventListener('click', function(){
    bsOffcanvas.show();
})

document.getElementById("mainrow").onclick = function(){
    if (isVisible){
        bsOffcanvas.hide();
    }
}