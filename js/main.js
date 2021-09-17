// Song Data
const songList = [
    {
        title: 'Just a Thought',
        file: 'Just a Thought.mp3',
        cover: 'cover1.jpg'
    },
    {
        title: 'Spirit of Fire',
        file: 'Spirit of Fire.mp3',
        cover: 'cover2.jpg'
    },
    {
        title: 'The Best Time',
        file: 'The Best Time.mp3',
        cover: 'cover3.jpg'
    }
]
// API DE PRUEBAS
// fetch("https://theaudiodb.p.rapidapi.com/searchtrack.php?s=coldplay&t=yellow", {
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-host": "theaudiodb.p.rapidapi.com",
// 		"x-rapidapi-key": "f86e939135mshf2cbedc4a5edc07p1d0028jsn449fafe422a6"
// 	}
// })
// .then(response => {
// 	console.log(response.url);
// })
// .catch(err => {
// 	console.error(err);
// });

// Cancion Actual
let actualSong = null;
let isOpen = false;
// Capturar elementos del DOM
const songs = document.getElementById('songs');
const audio = document.getElementById('audio');
const cover = document.getElementById('cover');
const title = document.getElementById('title');
const prev = document.getElementById('prev');
const play = document.getElementById('play');
const next = document.getElementById('next');
const moreMusic = document.getElementById('moreMusic'); 
const progress = document.getElementById('progress');
const currTime = document.getElementById('current-time');
const maxDuration = document.getElementById('max-duration');
const progressContainer = document.getElementById("progress-container");
progressContainer.addEventListener("click", setProgress);

// Escuchar el elemento audio
audio.addEventListener('timeupdate', updateProgress);

// Escuchar el elemento More Music
moreMusic.addEventListener('click', () =>{
    if( isOpen == false ){
        songs.style.display = 'block';
        songs.style.opacity = 1;
        isOpen = true;
        moreMusic.classList.remove('fa-list-ul');
        moreMusic.classList.add('fa-times');
    } else {
        songs.style.display = 'none';
        songs.style.opacity = 0;
        isOpen = false;
        moreMusic.classList.add('fa-list-ul');
        moreMusic.classList.remove('fa-times');
    }
    
});
//Escuchar click's del boton play
play.addEventListener('click', () => {
    if (audio.paused) {
        playSong()
    } else {
        pauseSong()
    }
});

//Escuchar click's del boton prev
prev.addEventListener('click', () => prevSong());
//Escuchar click's del boton next
next.addEventListener('click', () => nextSong());

// Cargar canciones
function loadSongs() {
    songList.forEach((song, index) => {
        // Crear li
        const li = document.createElement('li');
        // Crear a
        const link = document.createElement('a');
        // Hidratar a
        link.textContent = song.title;
        link.href = '#';
        // Escuchar click's
        link.addEventListener('click', () => loadSong(index));
        // Añadir a li
        li.appendChild(link);
        // Añadir li a ul
        songs.appendChild(li);
    });
}

//Cargar cancion seleccionada
function loadSong(songIndex) {
    if (songIndex != actualSong) {
        changeActiveClass(actualSong, songIndex);
        actualSong = songIndex;
        audio.src = "./audio/" + songList[songIndex].file;
        playSong();
        updateControls();
        changeSongCover(songIndex);
        changeSongTitle(songIndex);
    }
}
// Actualizar progreso
function updateProgress(event) {
    
    const { duration, currentTime } = event.srcElement;
    const percent = (currentTime / duration) * 100;
    progress.style.width = percent + "%";
    //Calculo de minuntos y segundos del tiempo transcurrido
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){ //if sec is less than 10 then add 0 before it
      currentSec = `0${currentSec}`;
    }
    currTime.innerText = `${currentMin}:${currentSec}`; 
    //Calculo de minuntos y segundos de la duracion 
    let mainAdDuration = duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if(totalSec < 10){ //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    }
    maxDuration.innerText = `${totalMin}:${totalSec}`;
    
}
// Barra actualizable
function setProgress(event) {
    const totalWidth = this.offsetWidth
    const progressWidth = event.offsetX
    const current = (progressWidth / totalWidth) * audio.duration
    audio.currentTime = current
}
// Actualizar controles
function updateControls() {
    if (audio.paused) {
        play.classList.remove('fa-pause');
        play.classList.add('fa-play');
    } else {
        play.classList.add('fa-pause');
        play.classList.remove('fa-play');
    }
}

// Reproducir cancion
function playSong() {
    audio.play();
    updateControls();
}

// Pausar cancion
function pauseSong() {
    audio.pause();
    updateControls();
}

//Cambiar clase activa
function changeActiveClass(lastIndex, newIndex) {
    const links = document.querySelectorAll("a")
    if (lastIndex !== null) {
        links[lastIndex].classList.remove("active")
    }
    links[newIndex].classList.add("active")
}

//Cambiar el titulo de la cancion
function changeSongTitle(songIndex) {
    title.textContent = songList[songIndex].title;
}

//Cambiar el cover de la cancion
function changeSongCover(songIndex) {
    cover.src = "./img/" + songList[songIndex].cover;
}

//change loop, shuffle, repeat icon onclick
const repeatBtn = document.getElementById("repeat-plist");
repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch(getText){
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

// Anterior cancion
function prevSong() {
    if (actualSong > 0) {
        loadSong(actualSong - 1);
    } else {
        loadSong(songList.length - 1);
    }

}

// Siguiente cancion
function nextSong() {
    if (actualSong < songList.length - 1) {
        loadSong(actualSong + 1);
    } else {
        loadSong(0)
    }

}

// Subir canciones
function uploadSongs(e){
    const files = Array.from(e.target.files);
    files.forEach(f =>{
       const reader = new fileReader();
       reader.onload = (function(archivo){
            return function(evt){

            }
       })(f)
    });
}

//code for what to do after song ended
audio.addEventListener("ended", ()=>{
    // we'll do according to the icon means if user has set icon to
    // loop song then we'll repeat the current song and will do accordingly
    let getText = repeatBtn.innerText; //getting this tag innerText
    switch(getText){
      case "repeat":
        nextSong(); //calling nextMusic function
        break;
      case "repeat_one":
        audio.currentTime = 0; //setting audio current time to 0
        loadSong(actualSong); //calling loadMusic function with argument, in the argument there is a index of current song
        playSong(); //calling playMusic function
        break;
      case "shuffle":
        let musicIndex;
        let randIndex = Math.floor((Math.random() * songList.length) + 1); //genereting random index/numb with max range of array length
        do{
          randIndex = Math.floor((Math.random() * songList.length) + 1);
        }while(musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
        musicIndex = randIndex; //passing randomIndex to musicIndex
        loadSong(musicIndex);
        playSong();
        break;
    }
  });
// Cambiar a la siguiente cancion cuando 
// audio.addEventListener('ended', () => nextSong());
//GO!

loadSongs();