var initList = document.getElementsByClassName("track_row_view linked");
var songList = [];

for (var i=0; i<initList.length;i++)
{
    songList.push(initList[i].children[0].children[0].children[0])
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.task == "songRequest")
    {
        console.log("songRequest");
        songList[request.index].click();
    }
});