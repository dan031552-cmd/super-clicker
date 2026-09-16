let seconds = 0;
let score = 0;
let realTimer = null;
let gameStarted = false;
let playerX = 14;
let playerY = 14;

const timer = document.getElementById("timer");
const scoreText = document.getElementById("score");
const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const target = document.getElementById("target");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const message = document.getElementById("message");
const characterButtons = document.querySelectorAll(".character-button");
const moveButtons = document.querySelectorAll(".move-button");

function reset() {
  clearInterval(realTimer);
  realTimer = null;
  seconds = 0;
  score = 0;
  gameStarted = false;
  playerX = 14;
  playerY = 14;
  timer.textContent = seconds;
  scoreText.textContent = score;
  placePlayer();
  target.style.left = "70%";
  target.style.top = "50%";
  startButton.textContent = "🚀 התחל משחק";
  message.textContent = "לחצו על \"התחל משחק\" כדי להתחיל!";
}

function startTimer() {
  clearInterval(realTimer);
  realTimer = setInterval(function () {
    seconds = seconds + 1;
    timer.textContent = seconds;
  }, 1000);
}

function startGame() {
  reset();
  gameStarted = true;
  startTimer();
  startButton.textContent = "🎮 המשחק רץ";
  message.textContent = "מעולה! התקרבו לכוכב ולחצו עליו!";
  moveTarget();
  gameArea.focus();
}

function moveTarget() {
  const maxX = Math.max(0, gameArea.clientWidth - target.offsetWidth);
  const maxY = Math.max(0, gameArea.clientHeight - target.offsetHeight);
  target.style.left = `${Math.floor(Math.random() * maxX)}px`;
  target.style.top = `${Math.floor(Math.random() * maxY)}px`;
}

function placePlayer() {
  const maxX = Math.max(0, gameArea.clientWidth - player.offsetWidth);
  const maxY = Math.max(0, gameArea.clientHeight - player.offsetHeight);
  playerX = Math.max(0, Math.min(playerX, maxX));
  playerY = Math.max(0, Math.min(playerY, maxY));
  player.style.left = `${playerX}px`;
  player.style.top = `${playerY}px`;
}

function movePlayer(direction) {
  if (!gameStarted) {
    message.textContent = "קודם לחצו על \"התחל משחק\"!";
    return;
  }

  const step = 16;
  if (direction === "right") playerX += step;
  if (direction === "left") playerX -= step;
  if (direction === "down") playerY += step;
  if (direction === "up") playerY -= step;
  placePlayer();
}

function handleKeyboard(event) {
  const keys = {
    ArrowRight: "right", d: "right", D: "right",
    ArrowLeft: "left", a: "left", A: "left",
    ArrowDown: "down", s: "down", S: "down",
    ArrowUp: "up", w: "up", W: "up"
  };
  const direction = keys[event.key];
  if (!direction) return;
  event.preventDefault();
  movePlayer(direction);
}

function playerTouchesTarget() {
  const playerBox = player.getBoundingClientRect();
  const targetBox = target.getBoundingClientRect();
  return playerBox.left < targetBox.right && playerBox.right > targetBox.left && playerBox.top < targetBox.bottom && playerBox.bottom > targetBox.top;
}

function collectTarget() {
  if (!gameStarted) {
    message.textContent = "התחילו את המשחק לפני שתופסים כוכבים!";
    return;
  }
  if (playerTouchesTarget()) {
    score += 1;
    scoreText.textContent = score;
    message.textContent = `יש! תפסתם כוכב — ${score} נקודות!`;
    moveTarget();
  } else {
    message.textContent = "כמעט! התקרבו עם השחקן לכוכב ואז לחצו.";
    target.animate([{ transform: "translateX(0)" }, { transform: "translateX(8px)" }, { transform: "translateX(-8px)" }, { transform: "translateX(0)" }], { duration: 250 });
  }
}

function changeCharacter(event) {
  const faces = { fox: "🦊", cat: "🐱", bear: "🐻" };
  player.textContent = faces[event.currentTarget.dataset.character];
  characterButtons.forEach(button => button.classList.remove("active"));
  event.currentTarget.classList.add("active");
}

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", reset);
target.addEventListener("click", collectTarget);
document.addEventListener("keydown", handleKeyboard);
characterButtons.forEach(button => button.addEventListener("click", changeCharacter));
moveButtons.forEach(button => button.addEventListener("click", () => movePlayer(button.dataset.direction)));
window.addEventListener("resize", placePlayer);
reset();
