let timer; // reference to the interval
let isWorkSession = true; // tracks if it's work or break

let workDurationMinutes = 25;
let breakDurationMinutes = 5;

const NOTIFICATION_SOUND = new Audio('sounds/Ticklo-Notification.ogg');

function getWorkDuration() {
    return workDurationMinutes * 60;
}

function getBreakDuration() {
    return breakDurationMinutes * 60;
}

let timeLeft = getWorkDuration();

let pomodoro_status = 'Ready to Work'; // Initial status message

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    document.getElementById('pomodoro_clock').textContent = `${minutes}:${seconds}`;
    document.getElementById('pomodoro_status').textContent = pomodoro_status;
}

function playNotificationSound() {
    const sound = NOTIFICATION_SOUND.cloneNode(); // Create a fresh copy
    sound.play().catch((e) => console.warn("Sound playback failed:", e));
}

function startTimer() {
    if (timer) return; // prevent multiple intervals

    pomodoro_status = isWorkSession ? 'Working' : 'Break time';
    updateDisplay();

    timer = setInterval(async () => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timer);
            timer = null;

            if (isWorkSession) {
                playNotificationSound(); // Play sound when session ends
                await showNotification('✅ Work session complete! Let\'s take a break!');
                isWorkSession = false;
                pomodoro_status = 'Break time';
            } else {
                playNotificationSound(); // Play sound when session ends
                await showNotification('🕒 Break complete! Let\'s get back to work!');
                isWorkSession = true;
                pomodoro_status = 'Working';
            }


            timeLeft = isWorkSession ? getWorkDuration() : getBreakDuration();

            document.getElementById('pomodoro_status').textContent = pomodoro_status;
            updateDisplay();
            startTimer(); // Continue after user confirms
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    stopTimer(); // make sure to stop any ongoing timer

    timeLeft = isWorkSession ? getWorkDuration() : getBreakDuration();
    updateDisplay();

    const status = isWorkSession ? 'Ready to Work' : 'Ready to Break';
    document.getElementById('pomodoro_status').textContent = status;
}

function showNotification(message) {
    return new Promise((resolve) => {
        const backdrop = document.getElementById('notification-backdrop');
        const messageEl = document.getElementById('notification-message');
        const actionBtn = document.getElementById('notification-action');

        messageEl.textContent = message;
        backdrop.classList.add('show');

        const handleClick = () => {
            backdrop.classList.remove('show');
            actionBtn.removeEventListener('click', handleClick);
            resolve(); // Let timer continue
        };

        actionBtn.addEventListener('click', handleClick);
    });
}

function showFadingAlert(message, duration = 2000) {
    const alertEl = document.getElementById('custom-alert');
    alertEl.textContent = message;
    alertEl.classList.add('show');

    setTimeout(() => {
        alertEl.classList.remove('show');
    }, duration);
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


    document.getElementById('apply_settings_button').addEventListener('click', () => {
        const workInput = parseFloat(document.getElementById('work_duration_input').value);
        const breakInput = parseFloat(document.getElementById('break_duration_input').value);

        if (!isNaN(workInput) && !isNaN(breakInput) && workInput > 0 && breakInput > 0) {
            workDurationMinutes = workInput;
            breakDurationMinutes = breakInput;

            showFadingAlert(`Settings updated: Work ${workDurationMinutes} min, Break ${breakDurationMinutes} min`);
            playNotificationSound(); // Play sound to indicate settings change

            resetTimer(); // Optional: apply immediately
        } else {
            alert("Please enter valid positive numbers.");
        }
    });


});


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((reg) => console.log('✅ Service worker registered:', reg.scope))
            .catch((err) => console.error('Service worker registration failed:', err));
    });
}
