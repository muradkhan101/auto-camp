"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var songInfo;
chrome.runtime.sendMessage({ task: "getData" }, function (response) {
  songInfo = response;
});
var updateState;
var updateIndex;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.task === "songDetails") {
    songInfo = { duration: request.duration, artist: request.artist,
      album: request.album, art: request.art, name: request.name,
      index: request.index };
    updateState(songInfo);
    document.getElementById("trackList").addEventListener("click", function (e) {
      updateIndex(e.target.value - 1);
      chrome.runtime.sendMessage({ task: "skipToSong", index: e.target.value - 1 });
    });
  } else if (request.task === "updateIndex") {
    updateIndex(request.index);
  } else if (request.task === "updateIt") {
    songInfo = { duration: request.duration, artist: request.artist,
      album: request.album, art: request.art, name: request.name,
      index: request.index };
    updateState(songInfo);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  var Container = function (_React$Component) {
    _inherits(Container, _React$Component);

    function Container() {
      _classCallCheck(this, Container);

      var _this = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this));

      if (songInfo) {
        _this.state = Object.assign({ show: false }, songInfo);
      }
      _this.updateSongData = _this.updateSongData.bind(_this);
      updateState = _this.updateSongData.bind(_this);
      _this.updateSongIndex = _this.updateSongIndex.bind(_this);
      updateIndex = _this.updateSongIndex.bind(_this);
      return _this;
    }

    _createClass(Container, [{
      key: "updateSongData",
      value: function updateSongData(data) {
        this.setState(data);
      }
    }, {
      key: "updateSongIndex",
      value: function updateSongIndex(index) {
        this.setState({ index: index });
      }
    }, {
      key: "showTracks",
      value: function showTracks() {
        this.setState({ show: !this.state.show });
      }
    }, {
      key: "render",
      value: function render() {
        if (songInfo) {
          return React.createElement(
            "div",
            { id: "container" },
            React.createElement(
              "h1",
              { className: "text-center", id: "header" },
              "Auto-Camp"
            ),
            React.createElement(Buttons, null),
            React.createElement(SongInfo, { art: this.state.art, song: this.state.name[this.state.index],
              artist: this.state.artist, album: this.state.album }),
            React.createElement("br", null),
            React.createElement(
              "div",
              { className: "centerThis" },
              React.createElement("button", { className: "glyphicon glyphicon-backward", id: "repeat",
                onClick: sendRepeatMessage }),
              React.createElement("button", { className: "glyphicon glyphicon-pause", id: "pause",
                onClick: sendPauseMessage }),
              React.createElement("button", { className: "glyphicon glyphicon-forward", id: "skip",
                onClick: sendSkipMessage }),
              React.createElement("button", { className: "glyphicon glyphicon-th-list", id: "showTracks",
                onClick: this.showTracks.bind(this) })
            ),
            React.createElement(TrackList, { songs: this.state.name, view: this.state.show })
          );
        } else {
          return React.createElement(
            "div",
            { id: "container" },
            React.createElement(
              "h1",
              { className: "text-center", id: "header" },
              "Auto-Camp"
            ),
            React.createElement(Buttons, null),
            React.createElement(SongInfo, { art: "icons/icon64.png", song: "Use buttons to load music",
              artist: "Artist", album: "Album" }),
            React.createElement(
              "div",
              { className: "centerThis" },
              React.createElement("button", { className: "glyphicon glyphicon-backward", id: "repeat" }),
              React.createElement("button", { className: "glyphicon glyphicon-pause", id: "pause" }),
              React.createElement("button", { className: "glyphicon glyphicon-forward", id: "skip" })
            )
          );
        }
      }
    }]);

    return Container;
  }(React.Component);

  function SongInfo(props) {
    return React.createElement(
      "div",
      { id: "music-info" },
      React.createElement(
        "div",
        { id: "albumArt", className: "float-l" },
        React.createElement("img", { src: props.art })
      ),
      React.createElement(
        "div",
        { id: "songName", className: "text-center" },
        props.song
      ),
      React.createElement(
        "div",
        { id: "artistAlbum", className: "text-center" },
        props.album + " by " + props.artist
      )
    );
  }

  function Buttons(props) {
    return React.createElement(
      "div",
      { id: "buttonHolder", className: "text-center" },
      React.createElement(
        "button",
        { className: "btn btn-primary", id: "extract",
          onClick: sendExtractMessage },
        "Scrape Data"
      ),
      React.createElement(
        "button",
        { className: "btn btn-primary", id: "play",
          onClick: sendPlayMessage },
        "Start Album"
      )
    );
  }

  function TrackList(props) {
    var songList = props.songs;
    var finalList = [];
    for (var i = 0; i < songList.length; i++) {
      finalList.push(React.createElement(
        "li",
        { value: i + 1 },
        songList[i]
      ));
    }
    var classes = props.view ? "visible" : "hidden";
    return React.createElement(
      "ol",
      { id: "trackList", className: classes },
      finalList
    );
  }

  ReactDOM.render(React.createElement(Container, null), document.getElementById("container"));
});

function sendSkipMessage() {
  chrome.runtime.sendMessage({ "task": "skip" });
}

function sendPauseMessage() {
  chrome.runtime.sendMessage({ "task": "pause" });
}

function sendRepeatMessage() {
  chrome.runtime.sendMessage({ "task": "repeat" });
}

function sendExtractMessage() {
  chrome.runtime.sendMessage({ "task": "extractList" });
}

function sendPlayMessage() {
  chrome.runtime.sendMessage({ "task": "playSong" });
}

function sendResetMessage() {
  chrome.runtime.sendMessage({ "task": "reset" });
}