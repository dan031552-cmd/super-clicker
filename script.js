const GAME_TIME = 60;
const STORAGE_PROFILE = "superClickerProfile";
const STORAGE_SCORES = "superClickerScores";

let secondsLeft = GAME_TIME;
let score = 0;
let realTimer = null;
let gameStarted = false;
let playerX = 14;
let playerY = 14;
let audioContext = null;

const timer = document.getElementById("timer");
const scoreText = document.getElementById("score");
const bestScoreText = document.getElementById("bestScore");
const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const target = document.getElementById("target");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const message = document.getElementById("message");
const characterButtons = document.querySelectorAll(".character-button");
const moveButtons = document.querySelectorAll(".move-button");
const profileForm = document.getElementById("profileForm");
const playerNameInput = document.getElementById("playerName");
const profileMessage = document.getElementById("profileMessage");
const inputCount = document.getElementById("inputCount");
const leaderboardList = document.getElementById("leaderboardList");
const clearLeaderboardButton = document.getElementById("clearLeaderboard");

function getProfileName() {
  return localStorage.getItem(STORAGE_PROFILE) || "שחקן אורח";
}

function getScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_SCORES)) || [];
  } catch {
    return [];
  }
}

function getBestScore() {
  const scores = getScores();
  return scores.length ? Math.max(...scores.map(result => result.score)) : 0;
}

function renderLeaderboard() {
  const scores = getScores().sort((a, b) => b.score - a.score).slice(0, 10);
  leaderboardList.innerHTML = "";
  if (!scores.length) {
    leaderboardList.innerHTML = "<li class=\"empty-leaderboard\">טבלת השיאים נקייה. היו הראשונים!</li>";
    return;
  }
  scores.forEach(function (result) {
    const item = document.createElement("li");
    item.innerHTML = `<span>🏆 ${result.name}</span><strong>${result.score} נקודות</strong>`;
    leaderboardList.appendChild(item);
  });
}

function saveResult() {
  const scores = getScores();
  scores.push({ name: getProfileName(), score });
  localStorage.setItem(STORAGE_SCORES, JSON.stringify(scores.slice(-50)));
  bestScoreText.textContent = getBestScore();
  renderLeaderboard();
}

function setupAudio() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioContext = new AudioContextClass();
  }
  if (audioContext && audioContext.state === "suspended") audioContext.resume();
}

function tone(frequency, duration, type = "sine", volume = 0.08, delay = 0) {
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.001, audioContext.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + delay + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + delay + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(audioContext.currentTime + delay);
  oscillator.stop(audioContext.currentTime + delay + duration + 0.03);
}

function playStartSound() {
  setupAudio();
  tone(392, 0.13, "triangle", 0.07);
  tone(523, 0.13, "triangle", 0.08, 0.12);
  tone(659, 0.22, "triangle", 0.09, 0.24);
}

function playCollectSound() {
  setupAudio();
  tone(880, 0.08, "sine", 0.07);
  tone(1175, 0.16, "sine", 0.08, 0.07);
}

function playEndSound() {
  setupAudio();
  tone(392, 0.22, "square", 0.08);
  tone(392, 0.22, "square", 0.08, 0.26);
  tone(523, 0.42, "square", 0.1, 0.52);
  tone(659, 0.55, "triangle", 0.1, 0.95);
}

function reset() {
  clearInterval(realTimer);
  realTimer = null;
  secondsLeft = GAME_TIME;
  score = 0;
  gameStarted = false;
  playerX = 14;
  playerY = 14;
  timer.textContent = secondsLeft;
  scoreText.textContent = score;
  bestScoreText.textContent = getBestScore();
  placePlayer();
  target.style.left = "70%";
  target.style.top = "50%";
  target.disabled = false;
  startButton.disabled = false;
  startButton.textContent = "🚀 התחל משחק";
  message.textContent = "שמרו שם ואז לחצו על \"התחל משחק\"!";
}

function finishGame() {
  clearInterval(realTimer);
  realTimer = null;
  gameStarted = false;
  target.disabled = true;
  startButton.disabled = false;
  startButton.textContent = "🚀 שחקו שוב";
  const previousBest = getBestScore();
  saveResult();
  playEndSound();
  const newRecord = score > previousBest && score > 0;
  message.textContent = newRecord ? `🏆 שיא חדש! סיימתם עם ${score} נקודות!` : `📯 הזמן נגמר! סיימתם עם ${score} נקודות.`;
}

function startTimer() {
  clearInterval(realTimer);
  realTimer = setInterval(function () {
    secondsLeft -= 1;
    timer.textContent = secondsLeft;
    if (secondsLeft <= 0) finishGame();
  }, 1000);
}

function startGame() {
  reset();
  setupAudio();
  playStartSound();
  gameStarted = true;
  target.disabled = false;
  startButton.disabled = true;
  startButton.textContent = "🎮 המשחק רץ";
  message.textContent = "הזמן התחיל! תפסו כמה שיותר כוכבים!";
  moveTarget();
  startTimer();
  gameArea.focus();
}

function moveTarget() {
  const maxX = Math.max(0, gameArea.clientWidth - target.offsetWidth - 4);
  const maxY = Math.max(0, gameArea.clientHeight - target.offsetHeight - 4);
  target.style.left = `${Math.floor(Math.random() * maxX)}px`;
  target.style.top = `${Math.floor(Math.random() * maxY)}px`;
}

function placePlayer() {
  const maxX = Math.max(0, gameArea.clientWidth - player.offsetWidth - 4);
  const maxY = Math.max(0, gameArea.clientHeight - player.offsetHeight - 4);
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
  const step = 18;
  if (direction === "right") playerX += step;
  if (direction === "left") playerX -= step;
  if (direction === "down") playerY += step;
  if (direction === "up") playerY -= step;
  placePlayer();
  checkAutomaticCollection();
}

function handleKeyboard(event) {
  const key = String(event.key || "").toLowerCase();
  const code = String(event.code || "");
  const keys = { arrowright: "right", d: "right", arrowleft: "left", a: "left", arrowdown: "down", s: "down", arrowup: "up", w: "up" };
  let direction = keys[key];
  if (!direction && code === "KeyD") direction = "right";
  if (!direction && code === "KeyA") direction = "left";
  if (!direction && code === "KeyS") direction = "down";
  if (!direction && code === "KeyW") direction = "up";
  if (!direction) return;
  event.preventDefault();
  movePlayer(direction);
}

function playerIsCloseToTarget() {
  const playerBox = player.getBoundingClientRect();
  const targetBox = target.getBoundingClientRect();
  const playerCenterX = playerBox.left + playerBox.width / 2;
  const playerCenterY = playerBox.top + playerBox.height / 2;
  const targetCenterX = targetBox.left + targetBox.width / 2;
  const targetCenterY = targetBox.top + targetBox.height / 2;
  const distance = Math.hypot(playerCenterX - targetCenterX, playerCenterY - targetCenterY);
  return distance < (playerBox.width + targetBox.width) * 0.95;
}

function collectTarget() {
  if (!gameStarted) {
    message.textContent = "התחילו את המשחק לפני שתופסים כוכבים!";
    return;
  }
  if (playerIsCloseToTarget()) {
    score += 1;
    scoreText.textContent = score;
    message.textContent = `⭐ יש! תפסתם כוכב — ${score} נקודות!`;
    playCollectSound();
    target.animate([{ transform: "scale(1)" }, { transform: "scale(1.5)" }, { transform: "scale(1)" }], { duration: 250 });
    moveTarget();
  } else {
    message.textContent = "כמעט! התקרבו יותר לכוכב ואז לחצו.";
    target.animate([{ transform: "translateX(0)" }, { transform: "translateX(8px)" }, { transform: "translateX(-8px)" }, { transform: "translateX(0)" }], { duration: 250 });
  }
}

function checkAutomaticCollection() {
  if (playerIsCloseToTarget()) collectTarget();
}

function changeCharacter(event) {
  event.preventDefault();
  const chosen = event.currentTarget.dataset.character;
  const faces = { fox: "🦊", cat: "🐱", bear: "🐻" };
  player.textContent = faces[chosen] || faces.fox;
  characterButtons.forEach(button => button.classList.remove("active"));
  event.currentTarget.classList.add("active");
  message.textContent = `הדמות הוחלפה ל${event.currentTarget.querySelector("span").textContent}!`;
}

profileForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = playerNameInput.value.trim();
  if (!name) return;
  localStorage.setItem(STORAGE_PROFILE, name);
  profileMessage.textContent = `שלום ${name}! הפרופיל נשמר במכשיר הזה.`;
  bestScoreText.textContent = getBestScore();
});

playerNameInput.addEventListener("input", function () { inputCount.textContent = `${playerNameInput.value.length}/16`; });
clearLeaderboardButton.addEventListener("click", function () { localStorage.removeItem(STORAGE_SCORES); renderLeaderboard(); bestScoreText.textContent = 0; });
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", reset);
target.addEventListener("click", collectTarget);
target.addEventListener("touchend", function (event) { event.preventDefault(); collectTarget(); }, { passive: false });
document.addEventListener("keydown", handleKeyboard, { passive: false });
characterButtons.forEach(button => { button.addEventListener("click", changeCharacter); button.addEventListener("touchend", changeCharacter, { passive: false }); });
moveButtons.forEach(button => { button.addEventListener("click", () => movePlayer(button.dataset.direction)); button.addEventListener("touchstart", event => { event.preventDefault(); movePlayer(button.dataset.direction); }, { passive: false }); });
window.addEventListener("resize", placePlayer);

playerNameInput.value = localStorage.getItem(STORAGE_PROFILE) || "";
inputCount.textContent = `${playerNameInput.value.length}/16`;
bestScoreText.textContent = getBestScore();
renderLeaderboard();
reset();
