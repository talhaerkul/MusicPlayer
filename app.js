const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const play = document.querySelector("#controls #play");
const prev = document.querySelector("#controls #prev");
const next = document.querySelector("#controls #next");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector("ul");


//sınıf üzerinden nesne oluşruma
const player = new MusicPlayer(musicList);
//sayfa yüklendiğinde ilk şarkıyı getir
window.addEventListener("load",() => {
    let music = player.getMusic();
    displayMusic(music);
    displayMusicList(player.musicList);
    isPlayingNow();
})
function displayMusic(music){
    title.innerText = music.getName();
    singer.innerText = music.singer;
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;
}   
//play tuşu
play.addEventListener("click", () => { 
    const isMusicPlay = container.classList.contains("playing");
    isMusicPlay ? pauseMusic() : playMusic();
})
//pause tuşu
const pauseMusic = () => {
    container.classList.remove("playing");
    play.querySelector("i").classList = "fa-solid fa-play";
    audio.pause();
}
const playMusic = () => {
    container.classList.add("playing");
    play.querySelector("i").classList = "fa-solid fa-pause";
    audio.play();
    isPlayingNow();
}
//geri tuşu
prev.addEventListener("click", () => { prevMusic(); })
const prevMusic = () => {
    player.prev();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}
//ileri tuşu
next.addEventListener("click", () => { nextMusic(); })
const nextMusic = () => {
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}
//dakika saniye göstergesi ve bar yüklenmesi
const calculateTime = (toplamSaniye) => {
    const dakika = Math.floor(toplamSaniye / 60);
    const saniye = Math.floor(toplamSaniye % 60);
    const saniye9 = saniye < 10 ? `0${saniye}`: `${saniye}`;
    const sonuc = `${dakika}:${saniye9}`;
    return sonuc; 
}
audio.addEventListener("loadedmetadata",() => {
    duration.textContent = calculateTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);
});
audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = calculateTime(progressBar.value);
})
//bar üzerinden süre seçimi
progressBar.addEventListener("input", () => {
    currentTime.textContent = calculateTime(progressBar.value);
    audio.currentTime = progressBar.value
})
//ses iconu ile sesi kapatıp açma
let muteState = "unmute";
volume.addEventListener("click", () => {
    if(muteState == "unmute"){
        audio.muted = true;
        muteState = "mute";
        volume.classList="fa solid fa-volume-xmark";
        volumeBar.value = 0;
    }
    else{
        audio.muted = false;
        muteState = "unmute";
        volume.classList="fa solid fa-volume-high";
        volumeBar.value = 100;
    }
})
//ses barı ile ses yüksekliğini değiştirme
volumeBar.addEventListener("input", (e) => {
    const value = e.target.value; //bar değeri 100e kadar yaptık fakat
    audio.volume = value / 100; //ses değeri 0 ile 1 arasında okunur
    if(value == 0){
        audio.muted = true;
        muteState = "mute";
        volume.classList="fa solid fa-volume-xmark";
    }
    else{
        audio.muted = false;
        muteState = "unmute";
        volume.classList="fa solid fa-volume-high";
    }
});
//listede müzikleri gösterme
const displayMusicList = (list) => {
    for(let i = 0; i < list.length; i++){
        let liTag = `
            <li li-index='${i}' onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
                <span>${list[i].getName()}</span>
                <span id="music-${i}" class="badge bg-primary rounded-pill"></span>
                <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
            </li>
        `;
        ul.insertAdjacentHTML("beforeend", liTag);

        let liAudioDuration = ul.querySelector(`#music-${i}`);
        let liAudioTag = ul.querySelector(`.music-${i}`);

        liAudioTag.addEventListener("loadeddata", () => {
            liAudioDuration.innerText = calculateTime(liAudioTag.duration);
        })
    }
}
//listeden müzik seçip oynatma
const selectedMusic = (li) => { //onclick eventinden gelen li
    player.index = li.getAttribute("li-index");
    displayMusic(player.getMusic());
    playMusic();
    isPlayNow();
}

const isPlayingNow = () => {
    for(let i of ul.querySelectorAll("li")){
        if(i.classList.contains("playing")){
            i.classList.remove("playing");
        }
        if(i.getAttribute("li-index") == player.index){
            i.classList.add("playing");
        }
    }
}

audio.addEventListener("ended", () => {
    nextMusic();
})