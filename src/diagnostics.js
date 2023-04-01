document.getElementById("healthTabs").style.setProperty("overflow-y", "auto");

let firstFlag = true;

function addTab(tabId, paneId, tableId, tableBodyId, title) {
  // Create the new tab
  var newTab = document.createElement('li');
  newTab.className = 'nav-item';
  newTab.style.setProperty("margin-right", "0px");
  newTab.innerHTML = '<a class="nav-link" id="' + tabId + '" data-bs-toggle="tab" href="#' + paneId + '">' + title + '</a>';

  // Add the new tab to the tab list
  var tabList = document.querySelector('#healthTabsItems');
  tabList.appendChild(newTab);

  // Create the new tab pane
  var newTabPane = document.createElement('div');
  newTabPane.className = 'tab-pane sysHealthPane';
  newTabPane.id = paneId;
  newTabPane.innerHTML = '<div class="table-responsive" id="' + tableId + '"><table class="table"><thead><tr class="sysRow" style="border-top-style: none;font-size: 24px;font-family: Roboto, sans-serif;"><th class="text-center" style="font-size: 18px;width: 25%;border-right: 3px solid var(--bs-gray-700);">Name</th><th class="text-center" style="font-size: 19px;width: 75%;">Message</th></tr></thead><tbody id="' + tableBodyId + '" style="width: 100%;"></tbody></table></div>';

  // Add the new tab pane to the tab content
  var tabContent = document.querySelector('#healthTabsContent');
  tabContent.appendChild(newTabPane);

  // Activate the new tab if it's the first tab
  if (firstFlag) {
    var triggerFirstTabEl = document.querySelector(`#healthTabsItems li:first-child a`)
    let firstTab = new bootstrap.Tab(triggerFirstTabEl)
    firstTab.show();
    firstFlag = false;
  }
}


function createNewRow(group, name, message){
    let table = document.getElementById(`${group}`);
    let newRow = table.insertRow();
    newRow.classList.add("sysRow");
    newRow.addEventListener("click", logName);
    newRow;
    let nameCell = newRow.insertCell();
    let messageCell = newRow.insertCell();
    nameCell.innerHTML = name;
    nameCell.id = `${name}NameCell`;
    messageCell.innerHTML = message;
    messageCell.id = `${name}MessageCell`;
}
  

// const ROSLIB = require('roslib');
// const ros = new ROSLIB.Ros({ url: "ws://localhost:9190" });

// const diagnosticMessages_listener = new ROSLIB.Topic({
//     ros: ros,
//     name: "/diagnostics_agg",
//     messageType: "diagnostic_msgs/DiagnosticArray"
// });
//{'groupName', [['rowName', 'message']]}
let groupDict = new Map();

diagnosticMessages_listener.subscribe((message) => {
  message.status.forEach(element => {
    if (element.name.split("/").length > 2) {
      let groupName = `${element.name.split("/")[2]}`;

      if (!groupDict.has(groupName)) {
        groupDict.set(groupName, []);
        addTab(`${groupName}`, `${groupName}Pane`, `${groupName}Table`, `${groupName}TableBody`, `${groupName}`);
      } else if (element.name.split("/").length > 3) {
        let rowName = `${element.name.split("/")[3]}`;
        if (!groupDict.get(groupName).flat().includes(rowName)) {
          createNewRow(`${groupName}TableBody`, rowName, element.message);
        }
        groupDict.set(groupName, [...groupDict.get(groupName), [rowName, element.message]]);
        document.getElementById(`${rowName}NameCell`).innerHTML = rowName;
        document.getElementById(`${rowName}MessageCell`).innerHTML = element.message;
      }
    }
  });
});



//   addTab('tab2', 'pane2', 'table2', 'table2Body', 'Tab 2');
//   addTab('tab3', 'pane3', 'table3', 'table3Body', 'Tab 3');


  