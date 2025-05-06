let timer; // reference to the interval
let isWorkSession = true; // tracks if it's work or break

const WORK_DURATION_MINUTES = 0.2; // Work session duration in minutes
const BREAK_DURATION_MINUTES = 0.1; // Break session duration in minutes

const WORK_DURATION = WORK_DURATION_MINUTES * 60; // Work session duration in seconds
const BREAK_DURATION = BREAK_DURATION_MINUTES * 60; // Break session duration in seconds

let timeLeft = WORK_DURATION; // Initialize time left to work session duration

let pomodoro_status = 'Ready to Work'; // Initial status message

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    document.getElementById('pomodoro_clock').textContent = `${minutes}:${seconds}`;
    document.getElementById('pomodoro_status').textContent = pomodoro_status;
}

function startTimer() {
    if (timer) return; // prevent multiple intervals

    pomodoro_status = isWorkSession ? 'Working' : 'Break time';
    updateDisplay();

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
                pomodoro_status = 'Break time';
                timeLeft = BREAK_DURATION;
            } else {
                alert('Break complete! Back to work.');
                isWorkSession = true;
                pomodoro_status = 'Working';
                timeLeft = WORK_DURATION;
            }

            document.getElementById('pomodoro_status').textContent = pomodoro_status;

            updateDisplay();
            startTimer(); // Automatically start the next session
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    stopTimer(); // make sure to stop any ongoing timer

    timeLeft = isWorkSession ? WORK_DURATION : BREAK_DURATION;
    updateDisplay();

    const status = isWorkSession ? 'Ready to Work' : 'Ready to Break';
    document.getElementById('pomodoro_status').textContent = status;
}

// Initial display
updateDisplay();

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('pomodoro_start_button');
    const stopBtn = document.getElementById('pomodoro_pause_button');
    const resetBtn = document.getElementById('pomodoro_reset_button');

    startBtn.addEventListener('click', startTimer);
    stopBtn.addEventListener('click', stopTimer);
    resetBtn.addEventListener('click', resetTimer);
});
