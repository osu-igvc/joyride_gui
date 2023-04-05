let vStream = document.getElementById("webcamThing");
vStream.addEventListener("error", function(){
  vStream.src="./assets/img/gorillamunch.jpg";
})

window.addEventListener("DOMContentLoaded", (event) =>{
  vStream.src="http://0.0.0.0:8080/stream?topic=/sensors/cameras/lane/image_raw";
});

let gorilladID = setInterval(() => {
    if(vStream.src.includes("gorillamunch.jpg")){
      vStream.src="http://0.0.0.0:8080/stream?topic=/sensors/cameras/lane/image_raw";
    }
    else if(vStream.src == "http://0.0.0.0:8080/stream?topic=/sensors/cameras/lane/image_raw"){
      vStream.removeAttribute("src");
      clearInterval(gorilladID);
      vStream.src="http://0.0.0.0:8080/stream?topic=/sensors/cameras/lane/image_raw"
      vStream.style.display = "initial";
    }
  }, 1000);






