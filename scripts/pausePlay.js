//Pauses or plays the song depending on the request received.

var musicPlayer = document.getElementsByTagName("video")[0];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.task == "pauseSong")
        musicPlayer.pause();
    else if (request.task == "resumeSong")
        musicPlayer.play();
});