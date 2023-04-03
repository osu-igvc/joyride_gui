document.getElementById("healthTabs").style.setProperty("overflow-y", "auto");

let firstFlag = true;

function addTab(tabId, paneId, tableId, tableBodyId, title) {
  // Create the new tab
  var newTab = document.createElement('li');
  newTab.className = 'nav-item';
  newTab.style.setProperty("margin-right", "0px");
  if(!firstFlag){
    newTab.style.setProperty("border-left", "3px solid var(--bs-gray-700)");
  }
  newTab.innerHTML = '<a class="nav-link" style="font-weight: bold" id="' + tabId + '" data-bs-toggle="tab" href="#' + paneId + '">' + title + '</a>';

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
    nameCell.style.setProperty("color", "var(--bs-white)");
    nameCell.style.setProperty("font-weight", "bold");
    nameCell.style.setProperty("--webkit-text-stroke", "1px");
    nameCell.style.setProperty("--webkit-text-stroke-color", "var(--bs-black)");
    nameCell.classList.add("gradientThing");
    nameCell.id = `${group}${name}NameCell`;

    messageCell.innerHTML = message;
    messageCell.style.setProperty("color", "var(--bs-white)");
    messageCell.style.setProperty("font-weight", "bold");
    messageCell.style.setProperty("--webkit-text-stroke", "1px");
    messageCell.style.setProperty("--webkit-text-stroke-color", "var(--bs-black)");
    messageCell.classList.add("gradientThing");
    messageCell.id = `${group}${name}MessageCell`;
}

function updateColorStatus(group, row, el){
  let rowId = `${group}TableBody${row}`;
  document.getElementById(`${rowId}NameCell`).innerHTML = row;
  document.getElementById(`${rowId}MessageCell`).innerHTML = el.message;
  switch (el.level) {
    case 0:
      document.getElementById(`${rowId}NameCell`).style.setProperty("--color1", "var(--bs-green)");
      document.getElementById(`${rowId}MessageCell`).style.setProperty("--color1", "var(--bs-green)");
      break;
    case 1:
      document.getElementById(`${rowId}NameCell`).style.setProperty("--color1", "var(--bs-yellow)");
      document.getElementById(`${rowId}MessageCell`).style.setProperty("--color1", "var(--bs-yellow)");
      break;
    case 2:
      document.getElementById(`${rowId}NameCell`).style.setProperty("--color1", "var(--bs-red)");
      document.getElementById(`${rowId}MessageCell`).style.setProperty("--color1", "var(--bs-red)");
      break;
    default:
      document.getElementById(`${rowId}NameCell`).style.setProperty("--color1", "var(--bs-gray-200)");
      document.getElementById(`${rowId}MessageCell`).style.setProperty("--color1", "var(--bs-gray-200)");
      break;
  }
  if(groupDict.get(group).flat().includes(2)){
    document.getElementById(`${group}`).style.setProperty("background-color", "var(--bs-red)");
  }
  else if(groupDict.get(group).flat().includes(1)){
    document.getElementById(`${group}`).style.setProperty("background-color", "var(--bs-yellow)");
  }
  else if(groupDict.get(group).flat().includes(0)){
    document.getElementById(`${group}`).style.setProperty("background-color", "var(--bs-green)");
  }
  else{
    document.getElementById(`${group}`).style.setProperty("background-color", "var(--bs-gray-200)");
  }
}

let groupDict = new Map();
diagnosticMessages_listener.subscribe((message) => {
  message.status.forEach(element => {
    if (element.name.split("/").length > 2) {
      let groupName = `${element.name.split("/")[2]}`;

      if (!groupDict.has(groupName)) {
        groupDict.set(groupName, []);
        addTab(`${groupName}`, `${groupName}Pane`, `${groupName}Table`, `${groupName}TableBody`, `${groupName}`);
      } 
      else if (element.name.split("/").length > 3) {
        let rowName = `${element.name.split("/")[3]}`.split(" ");
        rowName.shift();
        rowName.shift();
        rowName = rowName.join(" ");
        let existingRows = groupDict.get(groupName);
        let rowIndex = existingRows.findIndex(row => row[0] === rowName);
        if (rowIndex === -1) {
          createNewRow(`${groupName}TableBody`, rowName, element.message);
          existingRows.push([rowName, element.message, element.level]);
        } else {
          existingRows[rowIndex] = [rowName, element.message, element.level];
        }
        
        updateColorStatus(groupName, rowName, element);
        
      }
      
    }
  });
});


  