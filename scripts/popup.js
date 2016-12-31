// JavaScript Document

//var extractButton = document.getElementById("extract");
//var playButton = document.getElementById("play");

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("extract").addEventListener("click", sendExtractMessage);
    document.getElementById("play").addEventListener("click", sendPlayMessage);
	document.getElementById("repeat").addEventListener("click", sendRepeatMessage);
	document.getElementById("pause").addEventListener("click", sendPauseMessage);
	document.getElementById("skip").addEventListener("click", sendSkipMessage);
	document.getElementById("reset").addEventListener("click", sendResetMessage);
});

function sendSkipMessage() {
    chrome.runtime.sendMessage({"task": "skip"});
}

function sendPauseMessage() {
    chrome.runtime.sendMessage({"task": "pause"});
}

function sendRepeatMessage() {
    chrome.runtime.sendMessage({"task": "repeat"});
}

function sendExtractMessage() {
	chrome.runtime.sendMessage({"task": "extractList"});
}

function sendPlayMessage() {
    chrome.runtime.sendMessage({"task": "playSong"});
}

function sendResetMessage() {
    chrome.runtime.sendMessage({"task": "reset"});
}