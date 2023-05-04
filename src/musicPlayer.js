// function enableDragSort(listClass) {
//     const sortableLists = document.getElementsByClassName(listClass);
//     Array.prototype.map.call(sortableLists, (list) => {enableDragList(list)});
// }

// 
// function enableDragList(list) {
//     Array.prototype.map.call(list.children, (item) => {enableDragItem(item)});
// }

// function enableDragItem(item) {
//     item.setAttribute('draggable', true)
//     item.ondrag = handleDrag;
//     item.ondragend = handleDrop;
// }

// function handleDrag(item) {
//     const selectedItem = item.target,
//             list = selectedItem.parentNode,
//             x = event.clientX,
//             y = event.clientY;

//     selectedItem.classList.add('drag-sort-active');
//     let swapItem = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);

//     if (list === swapItem.parentNode) {
//         swapItem = swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
//         list.insertBefore(selectedItem, swapItem);
//     }
// }

// let topOfQueue = document.querySelector(".active");
// function handleDrop(item) {
//     item.target.classList.remove('drag-sort-active');

//     // Check if the item is in the first position
//     const newTopOfQueue = item.target.parentNode.children[0];
//     if(topOfQueue != newTopOfQueue){
//         newTopOfQueue.classList.add("active");
//         topOfQueue.classList.remove("active");
//         topOfQueue = newTopOfQueue;
//     }
    
// }

// (()=> {enableDragSort('drag-sort-enable')})();

const audio = document.getElementById("audioPlayer");
let musicQueue = [];
ipcRenderer.invoke("get-queue").then((queue) => {
    musicQueue = queue;
    updateQueue();
});

ipcRenderer.invoke("get-current-audio-state").then((state) => {
    audio.src = state.url;
    audio.currentTime = state.time;
    audio.volume = state.volume;
    audio.muted = state.muted;
    if(state.paused){
        audio.pause();
    }
    else{
        audio.play();
    }

    const currentSong = document.getElementById("currentSong");
    const currentArtist = document.getElementById("currentArtist");
    let song = state.url;
    console.log(song);
    let splitSong = song.split("-");
    let artist = splitSong.shift();
    artist = artist.split("/").pop();
    artist = artist.replaceAll("%20", " ");
    song = splitSong.join("-");
    song = song.replaceAll("%20", " ")
    song = song.replace(".mp3", "");

    console.log(song);
    if(song == ""){
        song = "No Song Playing";
        artist = "Artist";
    }
    currentSong.innerHTML = song;
    currentArtist.innerHTML = artist;


});

audio.addEventListener("volumechange", () => {
    if(audio.muted){
        ipcRenderer.invoke("mute", true);
    }
    else if(!audio.muted){
        ipcRenderer.invoke("mute", false);
    }
    ipcRenderer.invoke('volume', audio.volume);
});

audio.addEventListener("pause", () => {
    ipcRenderer.invoke("stop-song");
});

audio.addEventListener("play", () => {
    ipcRenderer.invoke("resume");
});

audio.addEventListener("ended", () => {
    document.getElementById("songQueue").children[0].remove();
    playNextSong();
});
   
audio.addEventListener("seeking", () => {
    audio.pause();
    ipcRenderer.invoke("stop-song");
});

audio.addEventListener("seeked", () => {
    ipcRenderer.invoke("seeked", audio.currentTime);
    ipcRenderer.invoke("resume");
    audio.play();
});


//play the next song in the queue
function playNextSong(){
    if(musicQueue.length > 0){
        const currentSong = document.getElementById("currentSong");
        const currentArtist = document.getElementById("currentArtist");
        let song = musicQueue.shift();
        let splitSong = song.split("-");
        let artist = splitSong.shift();
        song = splitSong.join("-");
        song = song.replace(".mp3", "");

        const fullSong = `${artist}-${song}.mp3`;
        const audioSrc = `./assets/music/${fullSong}`;
        audio.src = audioSrc;
        audio.play();
        ipcRenderer.invoke("play-song", audioSrc);
        currentSong.innerHTML = song;
        currentArtist.innerHTML = artist;
    }
}

//update the queue display
function updateQueue(){
    const queue = document.getElementById("songQueue");
    queue.innerHTML = "";
    musicQueue.forEach((song) => {
        const splitSong = song.split("-");
        const artist = splitSong.shift();
        // splitSong.shift();
        song = splitSong.join("-");
        song = song.replace(".mp3", "");
        const li = document.createElement("li");
        // 'class="list-group-item border rounded border-1" style="font-family: Roboto, sans-serif;font-size: 21px;"'
        li.classList.add("list-group-item", "border", "rounded", "border-1");
        li.style.setProperty("font-family", "Roboto, sans-serif");
        li.style.setProperty("font-size", "21px");
        li.addEventListener("click", () => {
            const audioSrc = `./assets/music/${artist}-${song}.mp3`;
            audio.src = audioSrc;
            audio.play();
            ipcRenderer.invoke("play-song", audioSrc);
            const songName = document.getElementById("currentSong");
            songName.innerHTML = song;
            const artistName = document.getElementById("currentArtist");
            artistName.innerHTML = artist;

            const queue = document.getElementById("songQueue");
            queue.removeChild(li);
            musicQueue = musicQueue.filter((item) => {
                return !item.includes(song);
            });

        });
        const span = document.createElement("span");
        span.innerHTML = `${song} - ${artist}`;
        li.appendChild(span);
        queue.appendChild(li);
    });
}