chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.task == "songRequest")
    {
        console.log("songRequest track: ", request.index);
        songList[request.index].click();
    }
});

//Scrapes the song duration information from the album page and stores it in an array

var durationHTML = document.getElementsByClassName("time secondaryText");
var songDuration = [];

for (var i = 1; i<durationHTML.length; i++)
{
    songDuration.push(durationHTML[i].innerText);
}

//Stores the 'Play Button' HTML tags so they can be used to auto-click later on
//There is probably a more direct way of getting to the play Button but this works for now

var initList = document.getElementsByClassName("track_row_view linked");
var songList = [];

for (var i=0; i<initList.length;i++)
{
    songList.push(initList[i].children[0].children[0].children[0])
}

console.log("Data extracted and ready to begin");

chrome.runtime.sendMessage({"task": "songDetails", "timeData": songDuration})