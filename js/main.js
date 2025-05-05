let timer; // reference to the interval
let isWorkSession = true; // tracks if it's work or break

const WORK_DURATION_MINUTES = 25; // Work session duration in minutes
const BREAK_DURATION_MINUTES = 5; // Break session duration in minutes

const WORK_DURATION = WORK_DURATION_MINUTES * 60; // Work session duration in seconds
const BREAK_DURATION = BREAK_DURATION_MINUTES * 60; // Break session duration in seconds

let timeLeft = WORK_DURATION; // Initialize time left to work session duration

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    document.getElementById('pomodoro_clock').textContent = `${minutes}:${seconds}`;
}

function startTimer() {
    if (timer) return; // prevent multiple intervals

    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timer);
            timer = null;

            if (isWorkSession) {
                alert('Work session complete! Time for a break.');
                isWorkSession = false;
                timeLeft = BREAK_DURATION;
            } else {
                alert('Break complete! Back to work.');
                isWorkSession = true;
                timeLeft = WORK_DURATION;
            }

            updateDisplay();
            startTimer(); // Automatically start the next session
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

// Initial display
updateDisplay();

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('pomodoro_start_button');
    const stopBtn = document.getElementById('pomodoro_pause_button');

    startBtn.addEventListener('click', startTimer);
    stopBtn.addEventListener('click', stopTimer);
});
