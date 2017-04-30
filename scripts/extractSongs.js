chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.task == "songRequest")
    {
        console.log("songRequest track: ", request.index);
        songList[request.index].click();
    }
});

//Scrapes the song duration information from the album page and stores it in an array
var currentSong  = document.getElementsByClassName("primaryText title_link")[0].innerText;
var durationHTML = document.getElementsByClassName("time secondaryText");
var titleInfo = document.getElementsByClassName("title");
var albumName = document.getElementById("name-section").children[0].innerText;
var artistName = document.getElementById("name-section").children[1].children[0].innerText;
var albumArt = document.getElementById("tralbumArt").children[0].href;
var songInfo = {duration: [], name: [], album: albumName, artist: artistName,
art: albumArt};

for (var i = 1; i<durationHTML.length; i++)
{
  songInfo.duration.push(durationHTML[i].innerText);
  songInfo.name.push(titleInfo[i].children[0].innerText);
  if (songInfo.name[i-1] === currentSong) {songInfo.index = i-1;}
}

//Stores the 'Play Button' HTML tags so they can be used to auto-click later on
//There is probably a more direct way of getting to the play Button but this works for now

var initList = document.getElementsByClassName("track_row_view linked");
var songList = [];

for (var i=0; i<initList.length;i++)
{
    songList.push(initList[i].children[0].children[0].children[0]);
}

console.log("data extracted, @ song index: " + songInfo.index);

chrome.runtime.sendMessage({"task": "songDetails", "duration": songInfo.duration,
"name": songInfo.name, "album": songInfo.album, "artist": songInfo.artist,
"index": songInfo.index, "art": songInfo.art})
