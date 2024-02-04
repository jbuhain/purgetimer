let defaultTime = 5;
let started = false;
let paused = true;
document.getElementById("pauseButton").disabled = true;
document.getElementById("resumeButton").disabled = true;
document.getElementById("resetButton").disabled = true;

document.addEventListener("DOMContentLoaded", function () {

    function checkStatus() {
        /// !started && paused: BEGINNING timer hasn't started, show duration buttons and start timer, hide pause,resume,reset
        if(!started && paused) {
            durationButtons.forEach(button => button.disabled = false);
            document.getElementById("timerButton").disabled = false;

            document.getElementById("pauseButton").disabled = true;
            document.getElementById("resumeButton").disabled = true;
            document.getElementById("resetButton").disabled = true;
        }  
        // started && !paused : TIMER IS PLAYING show pause and reset and hide duration buttons, start timer, resume 
        else if(started && !paused) {
            document.getElementById("pauseButton").disabled = false;
            document.getElementById("resetButton").disabled = false;

            durationButtons.forEach(button => button.disabled = true);
            document.getElementById("timerButton").disabled = true;
            document.getElementById("resumeButton").disabled = true;
            
        }
        // started && paused : PAUSED TIMER show resume and reset buttons and hide start timer, and pause, and duration buttons
        else if(started && paused) {
            document.getElementById("resumeButton").disabled = false;
            document.getElementById("resetButton").disabled = false;

            document.getElementById("timerButton").disabled = true;
            document.getElementById("pauseButton").disabled = true;
            durationButtons.forEach(button => button.disabled = true);
        }
        // !started && !paused : BUG? can't happen?
        else {
            // TODO: Bug? investigate why is this happening
            // NOTE: this occurs when start timer is clicked!
            // console.log("!started and !paused ... bug?");
            document.getElementById("pauseButton").disabled = false;
            document.getElementById("resetButton").disabled = false;

            durationButtons.forEach(button => button.disabled = true);
            document.getElementById("timerButton").disabled = true;
            document.getElementById("resumeButton").disabled = true;
        }
    }

    function sendMessage(action, data, callback) {
        chrome.runtime.sendMessage({ action, data }, callback);
    }

    function updateCountdownDisplay() {
        sendMessage("getCountdown", null, function (response) {

            if (response && response.countdown !== undefined) {
                insertTime(response.countdown);
                started = response.paused;
                paused = response.paused;
                checkStatus();
            }
        });
    }

    function reset() {
        defaultTime = 5;
        started = false;
        paused = true;
        checkStatus();
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
        defaultTime = parseInt(button.dataset.duration, 10);
        insertTime(defaultTime);
    }

    durationButtons.forEach(button => {
        button.onclick = () => handleButtonClick(button);
    });

    document.getElementById("pauseButton").addEventListener("click", () => sendMessage("pauseCountdown"));

    document.getElementById("resumeButton").addEventListener("click", function () {
        sendMessage("resumeCountdown")
        started = true;
        paused = false;
        checkStatus();
    });

    document.getElementById("resetButton").addEventListener("click", function () {
        sendMessage("resetCountdown");
        reset();
        insertTime(defaultTime);
    });

    document.getElementById("timerButton").addEventListener("click", function () {
        sendMessage("startCountdown", { seconds: defaultTime });
        started = true;
        paused = false;
        checkStatus();
    });

    updateCountdownDisplay();

    setInterval(updateCountdownDisplay, 100);
});
