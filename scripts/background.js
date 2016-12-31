//Initialize variables that will be used later on

var songTabID = 0;
var oldSongTabID;
var mainTabID;
var songDuration;
var currentSong=0;
//beginPlay is used to keep track of when it is okay for the webRequest listener to begin the next song if it hears a request
var beginPlay = false;
var songTimeRemaining;
//paused keeps track of if the song should be currently playing or paused, it is used for the Pause/Resume button
var paused = false;

//Plays next song once the alarm indicating the current song playing has ended goes off.

chrome.alarms.onAlarm.addListener(function(){
    console.log("Alarm went off");
    beginPlay = true;
    chrome.tabs.sendMessage(mainTabID, {"task": "songRequest", "index": currentSong});
});

//Listens for a request from the URL that Bandcamp songs are located at. Opens the URL in a new tab to play song.

chrome.webRequest.onResponseStarted.addListener(function(details) {
    if (beginPlay)
    {
        console.log("Response has been heard");
        beginPlay = false;
        openNextSong(details.url);
    }
}, {urls: ["https://p4.bcbits.com/*/*"]});

//Listens for messages from other scripts, the message contents are indicated by request.task

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.task == "extractList")
    {
     //Stores the ID for the album tab, that will be used later and executes the script that scrapes the song durations.   
        chrome.tabs.query({"active": true}, function(tab){
            mainTabID = tab[0].id;
});
        chrome.tabs.executeScript(null,{file: "scripts/extractSongs.js"});
    }
    else if (request.task == "songDetails")
    {
        //Stores the array of data for the length of each song
        songDuration = request.timeData;
    }
    else if (request.task == "playSong")
    {
        paused = false;
        beginPlay = true;
        chrome.tabs.sendMessage(mainTabID, {"task": "songRequest", "index": currentSong});
    }
    else if (request.task == "pause")
    {
        if (!paused)
        {
            
            console.log("Pausing song");
            paused = true;
            //Calculates and stores the amount of time remaining until the alarm goes of in milliseconds
            chrome.alarms.get(String(currentSong), function(alarm) {
                songTimeRemaining = (alarm.scheduledTime - Date.now())*((1/1000)*(1/60));
            });
            chrome.alarms.clear(String(currentSong));
            chrome.tabs.executeScript(songTabID, {"file": "scripts/pausePlay.js"});
            chrome.tabs.sendMessage(songTabID, {"task": "pauseSong"});
//            chrome.tabs.sendMessage(mainTabID, {"task": "songRequest", "index": (currentSong-1)});
        }
        else
        {
            console.log("Resuming song");
            paused = false;
            chrome.alarms.create(String(currentSong), {"delayInMinutes": songTimeRemaining});
            chrome.tabs.sendMessage(songTabID, {"task": "resumeSong"});
//            chrome.tabs.sendMessage(mainTabID, {"task": "songRequest", "index": (currentSong-1)});
        }
    }
    else if (request.task == "skip")
    {
        paused = false;
        console.log("Skipping song");
        beginPlay = true;
        chrome.alarms.clear(String(currentSong));
        chrome.tabs.sendMessage(mainTabID, {"task": "songRequest", "index": (currentSong)});
    }
    else if (request.task == "repeat")
    {
        paused = false;
        console.log("Replaying song");
        beginPlay = true;
        currentSong--;
        chrome.alarms.clear(String(currentSong));
        chrome.tabs.sendMessage(mainTabID, {"task": "songRequest", "index": currentSong});
    }
    else if (request.task == "reset")
    {
        console.log("Information reset");
        chrome.tabs.remove(songTabID);
        chrome.alarms.clearAll();
        songDuration = [];
        currentSong = 0;
        beginPlay=false;
        paused = false;
    }
});

//Takes the index from the songDuration matrix corresponding to the current song playing and sets an alarm for that length of time

function setTimer() {
    var songLength = timeToMinutes(songDuration[currentSong++]);
    chrome.alarms.create(String(currentSong), {"delayInMinutes": songLength})
    chrome.alarms.get(String(currentSong), function(alarm) {
        console.log("Alarm set", alarm);
    });
//    chrome.alarms.get(String(currentSong), function(alarm) {
//       console.log(alarm); 
//    });
}

//Converts time from a string in the form 'xx:xx' to a double for minutes

function timeToMinutes(timeString) {
    var colonPos = timeString.indexOf(":");
    var timeMins = 0;
    return (Number(timeString.slice(0, colonPos))+Number(timeString.slice(colonPos+1,timeString.length))/60);
}
 
//Creates a new tab using the URL passed, calls a function to close the last song tab, and calls a function to set a timer.
//The 3 second timeout gives enough time for the newly opened tab to load the song before switching back to the album tab.

function openNextSong(URL) {
    chrome.tabs.create({"url": URL}, function(tab) {
        oldSongTabID = songTabID;
        songTabID = tab.id;
    });
    
    if (currentSong != 0)
        closeTab(songTabID);
    setTimer();
    setTimeout(function() {
        chrome.tabs.update(mainTabID, {"active": true});
    }, 3000);
}

//Closes the tab with the ID given

function closeTab(tabID) {
    chrome.tabs.remove(tabID);
}
