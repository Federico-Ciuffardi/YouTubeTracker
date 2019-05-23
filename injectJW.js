var actualCode = `window.postMessage({
	secs:jwplayer().getPosition(),plat:"JW"
}, '*');
`;
var script = document.createElement('script');
script.textContent = actualCode;
(document.head||document.documentElement).appendChild(script);
alert(document.head)
script.remove();