document.getElementById("webcamThing").addEventListener("error", function(){
  document.getElementById("webcamThing").src="./assets/img/gorillamunch.jpg";
})

gorilladID = setInterval(() => {
    // console.log(document.getElementById("webcamThing").src);
    if(document.getElementById("webcamThing").src.includes("gorillamunch.jpg")){
      document.getElementById("webcamThing").src="http://0.0.0.0:8080/stream?topic=/sensors/cameras/lane/image_raw";
    }
    else if(document.getElementById("webcamThing").src=="http://0.0.0.0:8080/stream?topic=/sensors/cameras/lane/image_raw"){
      clearInterval(gorilladID);
      document.getElementById("webcamThing").style.display="initial";
    }
  }, 1000);