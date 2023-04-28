// function enableDragSort(listClass) {
//     const sortableLists = document.getElementsByClassName(listClass);
//     Array.prototype.map.call(sortableLists, (list) => {enableDragList(list)});
// }

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

const fs = require('fs');
const path = require('path');
let musicQueue = [];
function loadSongs(){
    const musicDir = path.join(__dirname, './assets/music');
    fs.readdir(musicDir, (err, files) => {
        if(err){
            console.log(err);
        } else {
            files.forEach(file => {
                if(file.endsWith('.mp3')){
                    musicQueue.push(file);
                }
            });
        }
    });
}


loadSongs();
setTimeout(() => {
    shuffleQueue();
    document.getElementById("songQueue").children[0].remove();
    playNextSong();
}, 250);

document.getElementById("audioPlayer").addEventListener("ended", () => {
    document.getElementById("songQueue").children[0].remove();
    playNextSong();
});

//randomize the queue
function shuffleQueue(){
    for(let i = musicQueue.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * i);
        const temp = musicQueue[i];
        musicQueue[i] = musicQueue[j];
        musicQueue[j] = temp;
    }
    updateQueue();
}

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

        const audio = document.getElementById("audioPlayer");
        const fullSong = `${artist}-${song}.mp3`;
        audio.src = `./assets/music/${fullSong}`;
        audio.play();
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
            const audio = document.getElementById("audioPlayer");
            audio.src = `./assets/music/${artist}-${song}.mp3`;
            audio.play();
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