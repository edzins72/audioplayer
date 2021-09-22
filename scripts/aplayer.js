// todo:
// disable unassigned
// display remaining time and selected audio
// check for media on loading
// better config

const configStr = [];
configStr[0] = "empty";
configStr[1] = "01.wav";
configStr[2] = "02.wav";
configStr[3] = "03.wav";

var audioElement;
var selectedAudio;

(function () {
  init();
})();

function init() {
  audioElement = document.getElementById("audioelement");
  createButtons();
  colorizeLoop();
  setInterval("onTimer()", 40);
  initAudioMeter();
}

function onTimer() {
  setButtonVisuals();
  setDisplay();
}

function playAud(i) {
  selectedAudio = i;
  playCurrentAud();
}

function playCurrentAud() {
  stopAud();
  audioElement.src = configStr[selectedAudio];
  audioElement.load();
  audioElement.play();
}

function stopAud() {
  audioElement.pause();
  audioElement.currentTime = 0;
}

function loopAud() {
  if (audioElement.loop) {
    audioElement.loop = false;
  } else {
    audioElement.loop = true;
  }
  colorizeLoop();
}

function colorizeLoop() {
  loopId = document.getElementById("loopButton");
  if (audioElement.loop) {
    loopId.style.background = "red";
  } else {
    loopId.style.background = "white";
  }
}

function createButtons() {
  for (j = 0; j < 5; j++) {
    for (i = 1; i <= 10; i++) {
      //insertString '<button id="btn1" onclick="playAud(1)" type="button">01</button>'
      let button = $("<button></button>");
      button.attr({
        id: `btn${j * 10 + i}`,
        onclick: `playAud(${j * 10 + i})`,
        type: "button",
      });
      let buttonName = j * 10 + i;
      if (j == 0 && i < 10) {
        buttonName = "0" + buttonName;
      }
      button.text(buttonName);
      $("#buttons").append(button);
    }
  }
}

function setButtonVisuals() {
  //console.log(document.getElementById('buttons'));
  for (i = 1; i < 51; i++) {
    btn = document.getElementById("btn" + i);
    if (i == selectedAudio) {
      btn.style.background = "red";
    } else {
      btn.style.background = "white";
    }
  }
}

function setDisplay() {
  document.getElementById("topLeftLine").value =
    "Name: " + configStr[selectedAudio];
  var a = audioElement.duration;
  var seconds = Math.round(a);
  var minutes = Math.trunc(a / 60);
  var tvFrames = Math.round((a - seconds) / (1 / 25));
  var remain = audioElement.duration - audioElement.currentTime;
  remain = remain.toFixed(2);
  document.getElementById("bottomLeftLine").value =
    "Len: " + minutes + ":" + seconds + "." + tvFrames;
  document.getElementById("bottomRightLine").value = "Remain: " + remain;
}

function initAudioMeter() {
  var myMeterElement = document.getElementById("peak-meter");
  var myAudio = document.getElementById("audioelement");
  var audioCtx = new window.AudioContext();
  //var audioCtx = new window.AudioContext(window.AudioContext || window.webkitAudioContext);
  var sourceNode = audioCtx.createMediaElementSource(myAudio);
  sourceNode.connect(audioCtx.destination);
  var meterNode = webAudioPeakMeter.createMeterNode(sourceNode, audioCtx);
  webAudioPeakMeter.createMeter(myMeterElement, meterNode, {});
  myAudio.addEventListener("play", function () {
    audioCtx.resume();
  });
}
