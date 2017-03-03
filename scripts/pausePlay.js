//Pauses or plays the song depending on the request received.

var musicPlayer = document.getElementsByTagName("video")[0];
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("received request");
    if (request.task == "pauseSong")
        musicPlayer.pause();
    else if (request.task == "resumeSong")
        musicPlayer.play();
});
