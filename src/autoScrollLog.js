let rosOutDiv = document.getElementById("rosOutDiv");
let diagnosticDiv = document.getElementById("diagnosticDiv");
let initialDiff = rosOutDiv.scrollHeight - rosOutDiv.scrollTop;
let rosScrolled = false;
let diagnosticScrolled = false;

function rosUpdateScroll(){
    if(!rosScrolled){
        rosOutDiv.scrollTop = rosOutDiv.scrollHeight;
    }
}

rosOutDiv.onscroll = function(){
    if (rosOutDiv.scrollTop + 0.1*initialDiff >= rosOutDiv.scrollHeight - initialDiff){
        rosScrolled = false;
    }
    else{
        rosScrolled = true;
    }
};

function diagnosticUpdateScroll(){
    if(!diagnosticScrolled){
        diagnosticDiv.scrollTop = diagnosticDiv.scrollHeight;
    }
}

diagnosticDiv.onscroll = function(){
    if (diagnosticDiv.scrollTop + 0.1*initialDiff >= diagnosticDiv.scrollHeight - initialDiff){
        diagnosticScrolled = false;
    }
    else{
        diagnosticScrolled = true;
    }
};

