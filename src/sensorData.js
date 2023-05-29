
const {Chart} = require("chart.js");
require("luxon");
require("chartjs-adapter-luxon");
const ChartStreaming = require('chartjs-plugin-streaming');
Chart.register(ChartStreaming);

var testVelData = {x: 0, y:0};
var testAccelData = {x: 0, y:0};
var testSteerAngleData = {x: 0, y:0};

Chart.defaults.set('plugins.streaming', {
    duration: 20000
});

const chart1Canv = document.getElementById('chart1Canv');
const chart1Chart = new Chart(chart1Canv, {
    type: 'line',
    data: {
        datasets: [{
        label: 'Velocity',
        borderColor: 'blue',
        backgroundColor: 'blue',
        data: []              // empty at the beginning
        },
        {
            label: 'Acceleration',
            borderColor: 'red',
            backgroundColor: 'red',
            data: []              // empty at the beginning
        },
        {
            label: 'Steering Angle',
            borderColor: 'green',
            backgroundColor: 'green',
            data: []              // empty at the beginning
        }]
    },
    options: {
        scales: {
        x: {
            type: 'realtime',   // x axis will auto-scroll from right to left
            realtime: {         // per-axis options
            duration: 20000,  // data in the past 20000 ms will be displayed
            refresh: 100,    // onRefresh callback will be called every 1000 ms
            delay: 1000,      // delay of 1000 ms, so upcoming values are known before plotting a line
            pause: false,     // chart is not paused
            ttl: undefined,   // data will be automatically deleted as it disappears off the chart
            frameRate: 24,    // data points are drawn 30 times every second
    
            // a callback to update datasets
            onRefresh: chart => {
                    chart.data.datasets[0].data.push(testVelData);
                    chart.data.datasets[1].data.push(testAccelData);
                    chart.data.datasets[2].data.push(testSteerAngleData);
                }
            }
        }
        }
    }
});


const chart2Canv = document.getElementById('chart2Canv');
const chart2Chart = new Chart(chart2Canv, {
    type: 'line',
    data: {
        datasets: [{
        label: 'Velocity',
        borderColor: 'blue',
        backgroundColor: 'blue',
        data: []              // empty at the beginning
        },
        {
            label: 'Acceleration',
            borderColor: 'red',
            backgroundColor: 'red',
            data: []              // empty at the beginning
        },
        {
            label: 'Steering Angle',
            borderColor: 'green',
            backgroundColor: 'green',
            data: []              // empty at the beginning
        }]
    },
    options: {
        scales: {
        x: {
            type: 'realtime',   // x axis will auto-scroll from right to left
            realtime: {         // per-axis options
            duration: 20000,  // data in the past 20000 ms will be displayed
            refresh: 100,    // onRefresh callback will be called every 1000 ms
            delay: 1000,      // delay of 1000 ms, so upcoming values are known before plotting a line
            pause: false,     // chart is not paused
            ttl: undefined,   // data will be automatically deleted as it disappears off the chart
            frameRate: 24,    // data points are drawn 30 times every second
    
            // a callback to update datasets
            onRefresh: chart => {
                chart.data.datasets[0].data.push(testVelData);
                chart.data.datasets[1].data.push(testAccelData);
                chart.data.datasets[2].data.push(testSteerAngleData);
            }
            }
        }
        }
    }
    });

const chart3Canv = document.getElementById('chart3Canv');
const chart3Chart = new Chart(chart3Canv, {
    type: 'line',
    data: {
        datasets: [{
        label: 'Velocity',
        borderColor: 'blue',
        backgroundColor: 'blue',
        data: []              // empty at the beginning
        },
        {
            label: 'Acceleration',
            borderColor: 'red',
            backgroundColor: 'red',
            data: []              // empty at the beginning
        },
        {
            label: 'Steering Angle',
            borderColor: 'green',
            backgroundColor: 'green',
            data: []              // empty at the beginning
        }]
    },
    options: {
        scales: {
        x: {
            type: 'realtime',   // x axis will auto-scroll from right to left
            realtime: {         // per-axis options
            duration: 20000,  // data in the past 20000 ms will be displayed
            refresh: 100,    // onRefresh callback will be called every 1000 ms
            delay: 1000,      // delay of 1000 ms, so upcoming values are known before plotting a line
            pause: false,     // chart is not paused
            ttl: undefined,   // data will be automatically deleted as it disappears off the chart
            frameRate: 24,    // data points are drawn 30 times every second
    
            // a callback to update datasets
            onRefresh: chart => {
                chart.data.datasets[0].data.push(testVelData);
                chart.data.datasets[1].data.push(testAccelData);
                chart.data.datasets[2].data.push(testSteerAngleData);
            }
            }
        }
        }
    }
});

const { steeringAngle_listener } = require("./allDaRos.js");
const { wheelSpeed_listener } = require("./allDaRos.js");

wheelSpeed_listener.subscribe((message) => {
    testVelData = {
        x: Date.now(),
        y: message.data
    };
    
});

steeringAngle_listener.subscribe((message) => {
    testSteerAngleData = {
        x: Date.now(),
        y: message.data
    };
});

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

