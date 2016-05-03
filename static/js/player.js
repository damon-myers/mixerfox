$(document).ready(function() {
	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	context = new AudioContext();
	loadSong();
	processData();
});

function loadSong() {
	var request = new XMLHttpRequest();
	var songQuery = GetURLParameter('song');
	var listQuery = GetURLParameter('list');
	if (songQuery) {	
		request.open('GET', '/play?song=' + songQuery, true);
		request.responseType = "arraybuffer";

		request.onload = function () {
			var Data = request.response;
			process(Data);
		};

		request.send();
	}
	if (listQuery) {
		alert("We're awful and aren't supporting playlist playback just yet! Sorry! :c");
	}
}

function process(Data) {
	source = context.createBufferSource(); // Create Sound Source
	context.decodeAudioData(Data, function(buffer) {
		source.buffer = buffer;
		source.connect(context.destination); 
		source.start(context.currentTime);
	});
} 

function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}