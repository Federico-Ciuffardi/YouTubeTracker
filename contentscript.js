window.addEventListener('message', function(event) {
	if (event.data.secs === undefined || event.source != window) {
		return;
	}
	transmit(event.data.secs)
}, false);
function transmit(seconds){
	chrome.runtime.sendMessage(seconds);
}