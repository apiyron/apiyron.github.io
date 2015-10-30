/* Copyright 2013 Chris Wilson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

	   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();
var audioInput = null,
	realAudioInput = null,
	inputPoint = null,
	audioRecorder = null;
var rafID = null;
var analyserContext = null;
var canvasWidth, canvasHeight;
var recIndex = 0;

var wraps = document.getElementsByClassName('wrap');/////////////////

window.SpeechRecognition = window.SpeechRecognition       ||
						   window.webkitSpeechRecognition ||
						   null;

var recognizer = new window.SpeechRecognition();
var output = document.getElementById('output');
var started = false;
// Recogniser doesn't stop listening even if the user pauses
recognizer.continuous = true;

recognizer.lang = "ru-RU";

recognizer.onerror = function(event) {
  alert('Recognition error: ' + event.message);
};

recognizer.onresult = function(event) {
  output.textContent += "\&#010;";

  for (var i = event.resultIndex; i < event.results.length; i++) {
	if (event.results[i].isFinal) {
	  output.textContent = event.results[i][0].transcript; //+ ' (Confidence: ' + event.results[i][0].confidence + ')';
	} else {
	  output.textContent += event.results[i][0].transcript;
	}
	if ((output.textContent == 'Russian') && (recognizer.lang == 'en-GB')) {
		started = false;
		recognizer.stop();
		recognizer.lang = 'ru-RU';
		document.getElementById('record').classList.remove('recording');
		alert('Язык: Русский');
		break;
	}
	else if ((output.textContent == 'английский') && (recognizer.lang == 'ru-RU')) {
		started = false;
		recognizer.stop();
		recognizer.lang = 'en-GB';
		document.getElementById('record').classList.remove('recording');
		alert('Language: English');
		break;
	}
	else if ((output.textContent == 'сброс') || (output.textContent == 'reset')) {
		wraps[1].style.display = "none";
		wraps[2].style.display = "none";
		wraps[0].style.backgroundImage = "none";
	}

  }
};

document.getElementById('record').addEventListener('click', function() {
	if (started) {
		this.classList.remove('recording');
		started = false;
		recognizer.stop();
		// alert(output.textContent.split(' '));
		output.textContent.split(' ').forEach(function(item, i, arr) {
			if(wraps[i]) {
				// alert(i);
				wraps[i].style.display = "flex";
				sendWord(item, i);
			}
			})

		// sendWord();
	}else {
		this.classList.add('recording');
		started = true;
		//output.textContent = '';
		  recognizer.interimResults = true;
		  recognizer.start();

		 //  try {
			// recognizer.start();
		 //  } catch(ex) {
			// alert(ex.message);
		 //  }
	}
});



/* TODO:

- offer mono option
- "Monitor input" switch


*/

function blobToFile(theBlob, fileName){
	//A Blob() is almost a File() - it's just missing the two properties below which we will add
	theBlob.lastModifiedDate = new Date();
	theBlob.name = fileName;
	return theBlob;
}

//mycode
function sendPostReq(data){
	var xmlhttp;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		 // console.log(xmlhttp.responseText)
		 console.log(xmlhttp.status);
		 console.log(xmlhttp.readyState);
		 console.log(xmlhttp.getAllResponseHeaders());
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			document.getElementById("text").innerHTML = xmlhttp.responseText;
		}
	}
	//"/asr_xml?uuid=01ae13cb744628b58fb536d496daa1e6&key=developers-simple-key&topic=maps"
	xmlhttp.open("POST","https://asr.yandex.net/asr_xml?uuid=01ae13cb744628b58fb536d496daa1e6&key=e9ea6538-c025-4fcc-b30d-d62a1a176ed8&topic=queries", true);
	xmlhttp.setRequestHeader("Content-type","audio/x-wav");
	xmlhttp.send(blobToFile(data, 'sound.wav'));
}
//

function callbackFunction(data) {
	console.log(data);
}

function sendWord(data, num){
	var xmlhttp;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		 // console.log(xmlhttp.responseText)
		 // console.log(xmlhttp.status);
		 // console.log(xmlhttp.readyState);
		 // console.log(xmlhttp.getAllResponseHeaders());
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var i = 0;
			var obj = JSON.parse(xmlhttp.responseText);
			while(true) {
				if (obj.data[i].images.standard_resolution.url) {
				url = obj.data[i].images.standard_resolution.url;
				break;
			}
			else i++;
			}

			var photos = document.getElementsByClassName("canvaz");
			var tags = document.getElementsByClassName("tag");
			photos[num].style.backgroundImage="url("+url+")";
			tags[num].style.display = "block";
			var string = 'Likes: ' + obj.data[i].likes.count + '\n';
			obj.data[i].tags.forEach(function(item, i, arr) {
				string += '#' + item + ' ';
			});
			string += '\n';
			obj.data[i].comments.data.forEach(function(item, i, arr) {
				string += item.from.username + ': ' + item.text +'\n';
			});
			tags[num].value = string;
			photos[num].addEventListener('click', function(){
				i++;
				while(i < 100) {
					if (obj.data[i].images.standard_resolution.url) {
					url = obj.data[i].images.standard_resolution.url;
					break;
				}
				else i++;
				}
				photos[num].style.backgroundImage="url("+url+")";
				var string = 'Likes: ' + obj.data[i].likes.count + '\n';
				obj.data[i].tags.forEach(function(item, i, arr) {
					string += '#' + item + ' ';
				});
				string += '\n';
				obj.data[i].comments.data.forEach(function(item, i, arr) {
					string += item.from.username + ': ' + item.text +'\n';
				});
				tags[num].value = string;
			})
			// document.getElementById("text").innerHTML = xmlhttp.responseText;
		}
	}
	//"/asr_xml?uuid=01ae13cb744628b58fb536d496daa1e6&key=developers-simple-key&topic=maps"
	xmlhttp.open("GET","https://api.instagram.com/v1/tags/"+data+"/media/recent?client_id=c9f5ad458cff4c65b790e2c9f1d701a8", true);
	xmlhttp.send(null);
}

function saveAudio() {
	audioRecorder.exportWAV( doneEncoding );
	// could get mono instead by saying
	// audioRecorder.exportMonoWAV( doneEncoding );
}

function gotBuffers( buffers ) {
	var canvas = document.getElementById( "wavedisplay" );

	drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );

	// the ONLY time gotBuffers is called is right after a new recording is completed -
	// so here's where we should set up the download.
	audioRecorder.exportWAV( doneEncoding );
}

function doneEncoding( blob ) {
	Recorder.setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
	recIndex++;
	sendPostReq(blob);//using yandex api
}


function convertToMono( input ) {
	var splitter = audioContext.createChannelSplitter(2);
	var merger = audioContext.createChannelMerger(2);

	input.connect( splitter );
	splitter.connect( merger, 0, 0 );
	splitter.connect( merger, 0, 1 );
	return merger;
}

function cancelAnalyserUpdates() {
	window.cancelAnimationFrame( rafID );
	rafID = null;
}

function updateAnalysers(time) {
	if (!analyserContext) {
		var canvas = document.getElementById("analyser");
		canvasWidth = canvas.width;
		canvasHeight = canvas.height;
		analyserContext = canvas.getContext('2d');
	}

	// analyzer draw code here
	{
		var SPACING = 3;
		var BAR_WIDTH = 1;
		var numBars = Math.round(canvasWidth / SPACING);
		var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

		analyserNode.getByteFrequencyData(freqByteData);

		analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
		analyserContext.fillStyle = '#F6D565';
		analyserContext.lineCap = 'round';
		var multiplier = analyserNode.frequencyBinCount / numBars;

		// Draw rectangle for each frequency bin.
		for (var i = 0; i < numBars; ++i) {
			var magnitude = 0;
			var offset = Math.floor( i * multiplier );
			// gotta sum/average the block, or we miss narrow-bandwidth spikes
			for (var j = 0; j< multiplier; j++)
				magnitude += freqByteData[offset + j];
			magnitude = magnitude / multiplier;
			var magnitude2 = freqByteData[i * multiplier];
			analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
			analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
		}
	}

	rafID = window.requestAnimationFrame( updateAnalysers );
}

function toggleMono() {
	if (audioInput != realAudioInput) {
		audioInput.disconnect();
		realAudioInput.disconnect();
		audioInput = realAudioInput;
	} else {
		realAudioInput.disconnect();
		audioInput = convertToMono( realAudioInput );
	}

	audioInput.connect(inputPoint);
}

function gotStream(stream) {
	inputPoint = audioContext.createGain();

	// Create an AudioNode from the stream.
	realAudioInput = audioContext.createMediaStreamSource(stream);
	audioInput = realAudioInput;
	audioInput.connect(inputPoint);

//    audioInput = convertToMono( input );

	analyserNode = audioContext.createAnalyser();
	analyserNode.fftSize = 2048;
	inputPoint.connect( analyserNode );

	audioRecorder = new Recorder( inputPoint );

	zeroGain = audioContext.createGain();
	zeroGain.gain.value = 0.0;
	inputPoint.connect( zeroGain );
	zeroGain.connect( audioContext.destination );
	updateAnalysers();
}

function initAudio() {
		if (!navigator.getUserMedia){
			navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		}
		if (!navigator.cancelAnimationFrame)
			navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
		if (!navigator.requestAnimationFrame)
			navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

		if (navigator.getUserMedia) {

			 navigator.getUserMedia(
		{
			"audio": {
				"mandatory": {
					"googEchoCancellation": "false",
					"googAutoGainControl": "false",
					"googNoiseSuppression": "false",
					"googHighpassFilter": "false"
				},
				"optional": []
			},
		}, gotStream, function(e) {
			alert('Error getting audio');
			console.log(e);
		});
		}
		else {
			console.log('suka')
		}
}

// window.addEventListener('load', initAudio );
