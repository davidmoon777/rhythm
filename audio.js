const audio = new Audio("assets/song.mp3");
function playMusic(){
audio.currentTime=0;
audio.play();
}
function stopMusic(){
audio.pause();
audio.currentTime=0;
}
