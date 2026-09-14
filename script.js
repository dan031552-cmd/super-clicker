let seconds = 0;
let score = 0;
let realTimer = null;
let gameStarted = false;
let playerX = 20;
let playerY = 20;

const timer = document.getElementById("timer");
const scoreText = document.getElementById("score");
const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const target = document.getElementById("target");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const characterButtons = document.querySelectorAll(".character-button");

function reset() {
  clearInterval(realTimer);
  seconds = 0;
  score = 0;
  gameStarted = false;
  playerX = 20;
  playerY = 20;
  timer.textContent = seconds;
  scoreText.textContent = score;
  player.style.transform = `translate(${playerX}px, ${playerY}px)`;
  target.style.left = "70%";
  target.style.top = "50%";
  startButton.textContent = "התחל משחק";
}

function startTimer() {
  clearInterval(realTimer);
  realTimer = setInterval(function () {
    seconds = seconds + 1;
    timer.textContent = seconds;
  }, 1000);
}

function stopTimer() {
  clearInterval(realTimer);
  realTimer = null;
}

function startGame() {
  reset();
  gameStarted = true;
  startTimer();
  startButton.textContent = "המשחק רץ";
  moveTarget();
}

function moveTarget() {
  const maxX = gameArea.clientWidth - target.offsetWidth;
  const maxY = gameArea.clientHeight - target.offsetHeight;
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);
  target.style.left = `${randomX}px`;
  target.style.top = `${randomY}px`;
}

function playerTouchesTarget() {
  const playerBox = player.getBoundingClientRect();
  const targetBox = target.getBoundingClientRect();

  return playerBox.left < targetBox.right &&
    playerBox.right > targetBox.left &&
    playerBox.top < targetBox.bottom &&
    playerBox.bottom > targetBox.top;
}

function collectTarget() {
  if (!gameStarted) {
    return;
  }

  if (playerTouchesTarget()) {
    score = score + 1;
    scoreText.textContent = score;
    moveTarget();
  } else {
    target.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(8px)" },
        { transform: "translateX(-8px)" },
        { transform: "translateX(0)" }
      ],
      { duration: 250 }
    );
  }
}

function movePlayer(event) {
  if (!gameStarted) {
    return;
  }

  const step = 10;
  const maxX = gameArea.clientWidth - player.offsetWidth;
  const maxY = gameArea.clientHeight - player.offsetHeight;

  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    playerX = playerX + step;
  }
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    playerX = playerX - step;
  }
  if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
    playerY = playerY + step;
  }
  if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
    playerY = playerY - step;
  }

  playerX = Math.max(0, Math.min(playerX, maxX));
  playerY = Math.max(0, Math.min(playerY, maxY));
  player.style.transform = `translate(${playerX}px, ${playerY}px)`;
}

function changeCharacter(event) {
  const chosenCharacter = event.currentTarget.dataset.character;
  const characterFaces = {
    fox: "🦊",
    cat: "🐱",
    bear: "🐻"
  };

  player.textContent = characterFaces[chosenCharacter];

  characterButtons.forEach(function (button) {
    button.classList.remove("active");
  });
  event.currentTarget.classList.add("active");
}

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", reset);
target.addEventListener("click", collectTarget);
document.addEventListener("keydown", movePlayer);

characterButtons.forEach(function (button) {
  button.addEventListener("click", changeCharacter);
});

reset();
