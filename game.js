const startBtn=document.getElementById("startBtn")
const game=document.getElementById("game")
const menu=document.getElementById("menu")
const result=document.getElementById("result")

const retryBtn=document.getElementById("retryBtn")
const menuBtn=document.getElementById("menuBtn")

const lanes=document.querySelectorAll(".lane")
const buttons=document.querySelectorAll(".touch")

const scoreText=document.getElementById("score")
const comboText=document.getElementById("combo")
const accuracyText=document.getElementById("accuracy")
const judgeText=document.getElementById("judgement")

let notes=[]
let combo=0
let score=0
let hit=0
let total=0
let startTime=0
let chartIndex=0
let gameEnded=false

startBtn.onclick=()=>{
menu.style.display="none"
game.style.display="block"
playMusic()
startGame()
}

retryBtn.onclick=()=>location.reload()
menuBtn.onclick=()=>{
game.style.display="none"
result.style.display="none"
menu.style.display="flex"
stopMusic()
}

function startGame(){
startTime=Date.now()
requestAnimationFrame(update)
}

function spawnNote(lane,type,duration=0){
let note=document.createElement("div")
note.classList.add(type==="long"?"long-note":"note")
note.style.top="0px"
lanes[lane].appendChild(note)

notes.push({lane,note, y:0, type,duration,startY:0})
}

function update(){
if(gameEnded)return

let now=Date.now()-startTime

while(chartIndex<chart.length && now>chart[chartIndex].time){
let c=chart[chartIndex]
spawnNote(c.lane,c.type,c.duration)
chartIndex++
}

notes.forEach((n,i)=>{
n.y+=4
n.note.style.top=n.y+"px"
if(n.y>window.innerHeight-120){
n.note.remove()
notes.splice(i,1)
judge("Miss")
}
})

if(chartIndex>=chart.length && notes.length===0 && !gameEnded){
endGame()
}

requestAnimationFrame(update)
}

function judge(type){
total++
if(type==="Perfect"){score+=300;combo++;hit++;showJudge("Perfect",true)}
else if(type==="Great"){score+=200;combo++;hit++;showJudge("Great")}
else if(type==="Good"){score+=100;combo++;hit++;showJudge("Good")}
else{combo=0;showJudge("Miss")}
updateUI()
}

function showJudge(text,rainbow=false){
judgeText.className=""
if(rainbow) judgeText.classList.add("rainbow")
judgeText.innerText=text
setTimeout(()=>{judgeText.innerText=""},400)
}

function updateUI(){
scoreText.innerText="Score: "+score
comboText.innerText="Combo: "+combo
accuracyText.innerText="Accuracy: "+(total===0?100:Math.floor(hit/total*100))+"%"
}

function hitNote(lane){
let hitline=window.innerHeight-140
for(let i=0;i<notes.length;i++){
let n=notes[i]
if(n.lane===lane){
let diff=Math.abs(n.y-hitline)
if(diff<20){n.note.remove();notes.splice(i,1);judge("Perfect");return}
if(diff<40){n.note.remove();notes.splice(i,1);judge("Great");return}
if(diff<70){n.note.remove();notes.splice(i,1);judge("Good");return}
}}
judge("Miss")
}

buttons.forEach(btn=>{
btn.addEventListener("touchstart",()=>hitNote(parseInt(btn.dataset.key)))
})

function endGame(){
gameEnded=true
game.style.display="none"
result.style.display="flex"
document.getElementById("finalScore").innerText="Score: "+score
document.getElementById("finalCombo").innerText="Max Combo: "+combo
document.getElementById("finalAccuracy").innerText="Accuracy: "+(total===0?100:Math.floor(hit/total*100))+"%"
stopMusic()
}
