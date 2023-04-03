
let velButt = document.getElementById("velocityButt");
velButt.draggable = true;
velButt.addEventListener("dragstart", drag);

let accelButt = document.getElementById("accelerationButt");
accelButt.draggable = true;
accelButt.addEventListener("dragstart", drag);

let steerAngleButt = document.getElementById("steerAngleButt");
steerAngleButt.draggable = true;
steerAngleButt.addEventListener("dragstart", drag);

let clearButt = document.getElementById("clearButt");
clearButt.draggable = true;
clearButt.addEventListener("dragstart", drag);

let timeButt = document.getElementById("timeButt");
timeButt.draggable = true;
timeButt.addEventListener("dragstart", drag);



window.addEventListener('DOMContentLoaded', (event) => {
    let chart1x = document.getElementById("chart1x");
    let chart1y = document.getElementById("chart1y");
    let chart2x = document.getElementById("chart2x");
    let chart2y = document.getElementById("chart2y");
    let chart3x = document.getElementById("chart3x");
    let chart3y = document.getElementById("chart3y");
    
    chart1x.addEventListener("dragover", allowDrop);
    chart1x.addEventListener("drop", dropChartY);
    chart1x.myParam = chart1Chart;
    chart1y.addEventListener("dragover", allowDrop);
    chart1y.addEventListener("drop", dropChartY);
    chart1y.myParam = chart1Chart;
    
    chart2x.addEventListener("dragover", allowDrop);
    chart2x.addEventListener("drop", dropChartY);
    chart2x.myParam = chart2Chart;
    chart2y.addEventListener("dragover", allowDrop);
    chart2y.addEventListener("drop", dropChartY);
    chart2y.myParam = chart2Chart;
    
    chart3x.addEventListener("dragover", allowDrop);
    chart3x.addEventListener("drop", dropChartY);
    chart3x.myParam = chart3Chart;
    chart3y.addEventListener("dragover", allowDrop);
    chart3y.addEventListener("drop", dropChartY);
    chart3y.myParam = chart3Chart;

    
});


function allowDrop(ev) {
  ev.preventDefault();  
//   console.log("You can drop");
  console.log(ev.target.id);
}

function drag(ev) {
    console.log("Dragging");
    ev.dataTransfer.setData("name", ev.target);
    ev.dataTransfer.setData("text", ev.target.innerHTML);
}

// function dropChartX(ev){
//     let chartChart = ev.currentTarget.myParam;
//     let graphName = ev.dataTransfer.getData("text");
//     console.log(ev.dataTransfer.getData("name"));
    
//     switch (graphName){
//         case 'Velocity': 
//             chartChart.data.labels = testVelData;
//             chartChart.options.scales.x.title.text = 'Velocity';
//             break;
//         case 'Acceleration': 
//             chartChart.data.labels = testAccelData;
//             chartChart.options.scales.x.title.text = 'Acceleration';
//             break;
//         case 'Steering Angle': 
//             chartChart.data.labels = testSteerAngleData;
//             chartChart.options.scales.x.title.text = 'Steering Angle';
//             break;
//         default:
//             chartChart.data.labels = testTimeData;
//             chartChart.options.scales.x.title.text = 'Time';

//     }
//     chartChart.update();
// }

function dropChartY(ev) {
    let chartChart = ev.currentTarget.myParam;
    console.log("Dropped");
    let stuff = ev.dataTransfer.getData("text");
    if (stuff == 'Velocity'){
        chartChart.setDatasetVisibility(0, chartChart.getDatasetMeta(0).hidden);
    }
    else if (stuff == 'Acceleration'){
        chartChart.setDatasetVisibility(1, chartChart.getDatasetMeta(1).hidden);
    }
    else if (stuff == 'Steering Angle'){
        chartChart.setDatasetVisibility(2, chartChart.getDatasetMeta(2).hidden);
    }
    else if (stuff == 'Clear'){
        chartChart.setDatasetVisibility(0, false);
        chartChart.setDatasetVisibility(1, false);
        chartChart.setDatasetVisibility(2, false);
    }
    
    chartChart.update();
}



    
