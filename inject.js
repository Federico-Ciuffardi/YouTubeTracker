var actualCode = `window.postMessage({
	secs:document.querySelector('.video-stream').getCurrentTime()
}, '*');
`;
var script = document.createElement('script');
script.textContent = actualCode;
(document.head||document.documentElement).appendChild(script);
script.remove();