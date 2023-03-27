// var testVelData = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.000404, 0.004, 0.024, 0.078, 0.186, 0.341, 0.506, 0.632, 0.696, 0.713, 0.714, 0.715, 0.715, 0.717, 0.718, 0.719, 0.72, 0.72, 0.72, 0.719, 0.719, 0.719, 0.719, 0.719, 0.719, 0.719, 0.719, 0.72, 0.721, 0.721, 0.721, 0.721, 0.721, 0.722, 0.722, 0.722, 0.697, 0.486, 0.068, -0.372, -0.625, -0.672, -0.67, -0.664, -0.657, -0.653, -0.65, -0.645, -0.639, -0.636, -0.632, -0.627, -0.622, -0.619, -0.616, -0.611, -0.606, -0.602, -0.598, -0.592, -0.588, -0.585, -0.58, -0.574, -0.569, -0.566, -0.561, -0.556, -0.551, -0.547, -0.542, -0.537, -0.534, -0.53, -0.524, -0.519, -0.515, -0.391, -0.141, 0.115, 0.253, 0.266, 0.272, 0.273, 0.272, 0.272];

// var testAccelData = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.001, 0.016, 0.094, 0.34, 0.864, 1.66, 2.483, 2.916, 2.672, 1.87, 0.959, 0.335, 0.073, 0.02, 0.023, 0.024, 0.022, 0.015, 0.008, 0.001, -0.005, -0.007, -0.003, 0.003, 0.004, -1.78e-14, -0.001, 0.003, 0.008, 0.011, 0.008, 0.003, -6.66e-15, 0.003, 0.007, 0.008, -0.078, -0.868, -2.967, -5.745, -7.268, -6.17, -3.46, -1.125, -0.082, 0.105, 0.104, 0.089, 0.088, 0.093, 0.089, 0.085, 0.09, 0.092, 0.081, 0.073, 0.081, 0.09, 0.089, 0.088, 0.092, 0.09, 0.082, 0.086, 0.101, 0.102, 0.089, 0.084, 0.092, 0.096, 0.094, 0.096, 0.094, 0.086, 0.084, 0.092, 0.096, 0.489, 1.702, 3.362, 4.248, 3.504, 1.882, 0.593, 0.086, 0.018, 0.007, 0.027];

// var testSteerAngleData = [0, 0.3, 0.4, 0.5, 0.6, 0.2, 0.2, 0.1, 0.2, 0.3, 0];
// var testTimeData = [0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95, 2.0, 2.05, 2.1, 2.15, 2.2, 2.25, 2.3, 2.35, 2.4, 2.45, 2.5, 2.55, 2.6, 2.65, 2.7, 2.75, 2.8, 2.85, 2.9, 2.95, 3.0, 3.05, 3.1, 3.15, 3.2, 3.25, 3.3, 3.35, 3.4, 3.45, 3.5, 3.55, 3.6, 3.65, 3.7, 3.75, 3.8, 3.85, 3.9, 3.95, 4.0, 4.05, 4.1, 4.15, 4.2, 4.25, 4.3, 4.35, 4.4, 4.45, 4.5, 4.55, 4.6, 4.65, 4.7, 4.75, 4.8, 4.85, 4.9, 4.95, 5.0, 5.05, 5.1, 5.15, 5.2, 5.25, 5.3, 5.35, 5.4, 5.45, 5.5, 5.55, 5.6, 5.65, 5.7, 5.75, 5.8, 5.85, 5.9, 5.95, 6.0, 6.05, 6.1, 6.15, 6.2];
const ROSLIB = require('roslib');
const ros = new ROSLIB.Ros({ url: "ws://localhost:9190" });

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
            frameRate: 30,    // data points are drawn 30 times every second
    
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
            frameRate: 30,    // data points are drawn 30 times every second
    
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
            frameRate: 30,    // data points are drawn 30 times every second
    
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

const wheelSpeed_listener1 = new ROSLIB.Topic({
    ros: ros,
    name: "/feedback/wheelspeed",
    messageType: "std_msgs/msg/Float32"
});

wheelSpeed_listener1.subscribe((message) => {
    testVelData = {
        x: Date.now(),
        y: message.data
    };
    
});

const steeringAngle_listener1 = new ROSLIB.Topic({
    ros: ros,
    name: "/feedback/steer_angle",
    messageType: "std_msgs/msg/Float32"
});

steeringAngle_listener1.subscribe((message) => {
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

