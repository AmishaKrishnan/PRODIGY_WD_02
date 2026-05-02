const display = document.getElementById('time-display');
const startPauseBtn = document.getElementById('start-pause-btn');
const lapBtn = document.getElementById('lap-btn');
const resetBtn = document.getElementById('reset-btn');
const lapsList = document.getElementById('laps-list');
const lapCount = document.getElementById('lap-count');

let intervalId = null;
let startTime = 0;
let elapsedTime = 0;
let lapTimes = [];
let isRunning = false;

function formatTime(ms) {
  const totalMilliseconds = ms % 1000;
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  const formattedMilliseconds = String(totalMilliseconds).padStart(3, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

function updateDisplay() {
  display.textContent = formatTime(elapsedTime);
}

function tick() {
  const now = Date.now();
  elapsedTime += now - startTime;
  startTime = now;
  updateDisplay();
}

function startWatch() {
  if (isRunning) return;
  isRunning = true;
  startTime = Date.now();
  intervalId = setInterval(tick, 16);
  startPauseBtn.textContent = 'Pause';
  lapBtn.disabled = false;
  resetBtn.disabled = false;
}

function pauseWatch() {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(intervalId);
  intervalId = null;
  startPauseBtn.textContent = 'Start';
}

function resetWatch() {
  pauseWatch();
  elapsedTime = 0;
  lapTimes = [];
  updateDisplay();
  renderLaps();
  lapBtn.disabled = true;
  resetBtn.disabled = true;
}

function recordLap() {
  if (!isRunning) return;
  lapTimes.unshift({
    index: lapTimes.length + 1,
    time: elapsedTime,
  });
  renderLaps();
}

function renderLaps() {
  lapsList.innerHTML = '';
  lapCount.textContent = lapTimes.length;

  lapTimes.forEach((lap) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span>Lap ${lap.index}</span>
      <span>${formatTime(lap.time)}</span>
    `;
    lapsList.appendChild(listItem);
  });
}

startPauseBtn.addEventListener('click', () => {
  if (isRunning) {
    pauseWatch();
  } else {
    startWatch();
  }
});

lapBtn.addEventListener('click', recordLap);
resetBtn.addEventListener('click', resetWatch);

updateDisplay();
