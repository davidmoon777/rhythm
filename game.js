const startBtn=document.getElementById("startBtn")
const menu=document.getElementById("menu")
const difficulty=document.getElementById("difficulty")
const diffBtns=document.querySelectorAll(".diffBtn")
const game=document.getElementById("game")

const lanes=document.querySelectorAll(".lane")
const buttons=document.querySelectorAll(".touch")

const scoreText=document.getElementById("score")
const comboText=document.getElementById("combo")
const accuracyText=document.getElementById("accuracy")
const judgeText=document.getElementById("judgement")

let notes=[]
let combo=0, score=0, hit=0, total=0, startTime=0, chartIndex=0
let gameEnded=false, speed=5

// 메뉴 → 난이도 선택
startBtn.onclick=()=>{
menu.style.display="none"
difficulty.style.display="flex"
}

// 난이도 선택 → 게임 시작
diffBtns.forEach(btn=>{
btn.onclick=()=>{
speed=parseInt(btn.dataset.speed)
difficulty.style.display="none"
game.style.display="block"
startTime=Date.now()
requestAnimationFrame(update)
}
})

// 노트 생성
function spawnNote(lane){
const note=document.createElement("div")
note.classList.add("note")
note.style.top="0px"
lanes[lane].appendChild(note)
notes.push({lane,note,y:0})
}

// 게임 루프
function update(){
if(gameEnded) return

let now=Date.now()-startTime

// 차트 기반 노트 생성
while(chartIndex<chart.length && now>chart[chartIndex].time){
spawnNote(chart[chartIndex].lane)
chartIndex++
}

// 노트 이동
notes.forEach((n,i)=>{
n.y+=speed
n.note.style.top=n.y+"px"

const hitline=window.innerHeight-140
if(n.y>hitline+50){
n.note.remove()
notes.splice(i,1)
judge("Miss")
}
})

// 하드 모드: 노트 점점 빨라짐
if(speed>5 && chartIndex>10) speed+=0.02

requestAnimationFrame(update)
}

// 판정
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

// 노트 히트
function hitNote(lane){
const hitline=window.innerHeight-140
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

// 모바일 터치
buttons.forEach(btn=>{
btn.addEventListener("touchstart",()=>hitNote(parseInt(btn.dataset.key)))
})
