//current tab url
var currentUrl;
chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    currentUrl = tabs[0].url;
});

//listen for time message
chrome.runtime.onMessage.addListener(function(msg) {
	trackers[se_list.value] = currentUrl.replace(/&t=[0-9]*/g, '')+"&t="+parseInt(Math.floor(msg, 10))//save current url erase previous time options and append the latest
	saveToStorage();
	//alert(trackers[se_list.value])
	chrome.tabs.getSelected(null, function(tab) {chrome.tabs.remove(tab.id);});//remove tab
});

//adds tracker to html list
function addToList(name) {
	var element = document.createElement("option");
	element.textContent = name;
	element.id = name+"_s"
	se_list.appendChild(element);
}

//erases tracker from html list
function removeFromList(name) {
    var element = document.getElementById(name+"_s");
    element.parentNode.removeChild(element);
}

//saves app data to storage
function saveToStorage() {
	localStorage.setItem("trackers", JSON.stringify(trackers));
}

//deletes the tracker with name id 
function deletetracker(name) {
	delete trackers[name];
	removeFromList(name);
	saveToStorage()
}

//creates a new tracker (used when bu_new button is pressed)
document.getElementById("bu_new").onclick=newtracker;
function newtracker() {
	var name = prompt("Name: ", "");
	if (!name) return;
	if (!trackers.hasOwnProperty(name)) {
		trackers[name] = "";
		addToList(name);
		saveToStorage();
	}else{
		alert("There is already a tracker with that name");
	}
	se_list.value = name;
}

//deletes the currently selected tracker on the popup (used when bu_delete button is pressed)
document.getElementById("bu_delete").onclick=deleteCurrenttracker;
function deleteCurrenttracker() {
	if(confirm("Are you sure you want to delete "+se_list.value+"?")){
		deletetracker(se_list.value);
	}
}

//renames the currently selected tracker on the popup (used when bu_rename button is pressed)
document.getElementById("bu_rename").onclick=rename;
function rename() {
	var name = prompt("New name: ", "");
	if (!name) return;
	if (!trackers.hasOwnProperty(name)) {
		trackers[name] =  trackers[se_list.value] ;
		addToList(name);
		saveToStorage();
		deletetracker(se_list.value);
	}else{
		alert("There is already a tracker with that name");
	}
	se_list.value = name;
}

//saves the current time of a youtube video on the current tab to the currently selected tracker on the popup (used when bu_pause button is pressed)
document.getElementById("bu_pause").onclick=pause;
function pause() {
	if(!(currentUrl.indexOf("youtube.com/watch")==-1)){
		chrome.tabs.executeScript({
			file: 'injectYT.js'
		});
		return;
	}
	trackers[se_list.value] = currentUrl//save current url
	saveToStorage();
	//alert(trackers[se_list.value])
	chrome.tabs.getSelected(null, function(tab) {chrome.tabs.remove(tab.id);});//remove tab
}

//resumes the yt vid corresponding to the currently selected tracker on the popup (used when bu_resume button is pressed)
document.getElementById("bu_resume").onclick=resume;
function resume() {
	if(trackers[se_list.value] == ""){
		alert("Not previously paused, pause at least one time");
		return
	}
	chrome.tabs.create({
		"url": trackers[se_list.value]
	});
}

//initialize
//get from HTML
var se_list = document.querySelector("#se_list");
//get from memory
var trackers = JSON.parse(localStorage.getItem("trackers")) || {"rename me":""};
//load from memory
for (var name in trackers){
	if (trackers.hasOwnProperty(name))
	addToList(name);
}
se_list.value = localStorage.getItem("lastSel") ||  trackers[0]
se_list.addEventListener("change", function(){
	localStorage.setItem("lastSel", se_list.value);
});
