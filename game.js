const startBtn = document.getElementById("startBtn")
const menu = document.getElementById("menu")
const difficulty = document.getElementById("difficulty")
const diffBtns = document.querySelectorAll(".diffBtn")
const game = document.getElementById("game")

const lanes = document.querySelectorAll(".lane")

const scoreText = document.getElementById("score")
const comboText = document.getElementById("combo")
const accuracyText = document.getElementById("accuracy")
const judgeText = document.getElementById("judgement")

let notes = []
let combo = 0, score = 0, hit = 0, total = 0
let startTime = 0
let gameEnded = false
let speed = 5
let spawnInterval = 800  // 노트 생성 간격
let lastSpawn = 0

// 메뉴 → 난이도 선택
startBtn.onclick = () => {
    menu.style.display = "none"
    difficulty.style.display = "flex"
}

// 난이도 선택 → 게임 시작
diffBtns.forEach(btn => {
    btn.onclick = () => {
        speed = parseInt(btn.dataset.speed)
        difficulty.style.display = "none"
        game.style.display = "block"
        startTime = Date.now()
        lastSpawn = 0
        requestAnimationFrame(update)
    }
})

// 노트 생성
function spawnNote(lane, type = "normal") {
    const note = document.createElement("div")
    note.classList.add(type === "long" ? "long-note" : "note")
    note.style.top = "0px"

    // 롱노트 길이 80~200px 랜덤
    let longHeight = 0
    if (type === "long") {
        longHeight = 80 + Math.random() * 120
        note.style.height = longHeight + "px"
    }

    lanes[lane].appendChild(note)

    let noteObj = {
        lane,
        note,
        y: 0,
        type,
        height: longHeight,
        holding: false
    }

    // 직접 터치 판정
    note.addEventListener("touchstart", e => {
        e.stopPropagation()
        if (noteObj.type === "normal") {
            hitNote(noteObj)
        } else {
            noteObj.holding = true
        }
    })
    note.addEventListener("touchend", e => {
        e.stopPropagation()
        if (noteObj.type === "long") {
            if (noteObj.holding) {
                hitNote(noteObj)
                noteObj.holding = false
            }
        }
    })

    notes.push(noteObj)
}

// 노트 판정
function hitNote(noteObj) {
    const laneIndex = noteObj.lane
    // 화면 기준 거리 (정확도 구간)
    const hitline = noteObj.y + noteObj.height/2
    const diff = Math.abs(hitline - (window.innerHeight - 140))
    if (diff < 20) {
        judge("Perfect")
    } else if (diff < 40) {
        judge("Great")
    } else if (diff < 70) {
        judge("Good")
    } else {
        judge("Miss")
        return
    }
    noteObj.note.remove()
    notes = notes.filter(n => n !== noteObj)
}

// 판정
function judge(type) {
    total++
    if (type === "Perfect") { score += 300; combo++; hit++; showJudge("Perfect", true) }
    else if (type === "Great") { score += 200; combo++; hit++; showJudge("Great") }
    else if (type === "Good") { score += 100; combo++; hit++; showJudge("Good") }
    else { combo = 0; showJudge("Miss") }
    updateUI()
}

// UI 갱신
function updateUI() {
    scoreText.innerText = "Score: " + score
    comboText.innerText = "Combo: " + combo
    accuracyText.innerText = "Accuracy: " + (total === 0 ? 100 : Math.floor(hit / total * 100)) + "%"
}

// 무한 게임 루프
function update() {
    if (gameEnded) return
    const now = Date.now() - startTime

    // 노트 끝없이 생성 (랜덤 라인)
    if (now - lastSpawn > spawnInterval) {
        const lane = Math.floor(Math.random() * lanes.length)
        const type = Math.random() < 0.2 ? "long" : "normal" // 20% 확률 롱노트
        spawnNote(lane, type)
        lastSpawn = now
    }

    // 노트 이동
    notes.forEach((n, i) => {
        n.y += speed
        n.note.style.top = n.y + "px"

        // 롱노트 유지 안하면 자동 Miss 처리
        if (n.type === "long" && n.holding === false && n.y > window.innerHeight - 140 + n.height) {
            n.note.remove()
            notes.splice(i, 1)
            judge("Miss")
        }

        // 일반 노트 화면 아래 지나가면 Miss
        if (n.type === "normal" && n.y > window.innerHeight - 120) {
            n.note.remove()
            notes.splice(i, 1)
            judge("Miss")
        }
    })

    // 하드 모드 속도 점점 증가
    if (speed > 5) speed += 0.01

    requestAnimationFrame(update)
}
