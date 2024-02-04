let initial_time = 5;
let ticking = false;

document.addEventListener("DOMContentLoaded", function () {

    function checkStatus() {
        if (!ticking) return;

        document.getElementById("timerButton").disabled = true;
        

        // if (paused) return;
        durationButtons.forEach(button => button.disabled = true);
    }

    function sendMessage(action, data, callback) {
        chrome.runtime.sendMessage({ action, data }, callback);
    }

    function updateCountdownDisplay() {
        sendMessage("getCountdown", null, function (response) {
            if (response && response.countdown !== undefined) {
                insertTime(response.countdown);
                ticking = response.paused;
                checkStatus();
            }
        });
    }

    function reset() {
        initial_time = 5;
        ticking = false;
        document.getElementById("timerButton").disabled = false;
        // if (paused) return;
        durationButtons.forEach(button => button.disabled = false);
    }

    function insertTime(seconds) {
        if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
            // Handle invalid input
            alert("Invalid input");
            return;
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        // Add leading zeros if needed
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

        let countdownDisplay = document.getElementById("timerDisplay");
        countdownDisplay.innerText = `${formattedMinutes}:${formattedSeconds}`;
    }

    const durationButtons = document.querySelectorAll(".duration-button");

    function handleButtonClick(button) {
        initial_time = parseInt(button.dataset.duration, 10);
        insertTime(initial_time);
    }

    durationButtons.forEach(button => {
        button.onclick = () => handleButtonClick(button);
    });

    document.getElementById("pauseButton").addEventListener("click", () => sendMessage("pauseCountdown"));
    document.getElementById("resumeButton").addEventListener("click", () => sendMessage("resumeCountdown"));

    document.getElementById("resetButton").addEventListener("click", function () {
        sendMessage("resetCountdown");
        reset();
    });

    document.getElementById("timerButton").addEventListener("click", function () {
        sendMessage("startCountdown", { seconds: initial_time });
        ticking = true;
        checkStatus();
    });

    updateCountdownDisplay();

    setInterval(updateCountdownDisplay, 100);
});
