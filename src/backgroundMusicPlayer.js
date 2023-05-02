const { ipcRenderer } = require('electron');
const audio = document.getElementById("backgroundMusicPlayer");

ipcRenderer.on("play-song", (event, songURL) => {
    audio.src = songURL;
    audio.play();
});

ipcRenderer.on("stop-song", () => {
    audio.pause();
});

ipcRenderer.on("volume", (event, volume) => {
    audio.volume = volume;
});

ipcRenderer.on("seek", (event, time) => {
    audio.currentTime = time;
});

ipcRenderer.on("mute", (event, mute) => {
    audio.muted = mute;
});

ipcRenderer.on("resume", () => {
    audio.play();
});

ipcRenderer.on("get-current-audio-state", (event) => {
    let backgroundAudio = {
        url: null,
        time: 0,
        volume: 0,
        muted: false,
        paused: false
    };
    backgroundAudio.url = audio.src;
    backgroundAudio.time = audio.currentTime;
    backgroundAudio.volume = audio.volume;
    backgroundAudio.muted = audio.muted;
    backgroundAudio.paused = audio.paused;

    ipcRenderer.send("current-audio-state", backgroundAudio);
});