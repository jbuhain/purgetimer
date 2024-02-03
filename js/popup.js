

document.addEventListener("DOMContentLoaded", function () {
    // Function to close all tabs and open a new one

    let timerSeconds = 600; // Initial countdown time is 10 minutes (10 * 60 seconds)

    function sendMessage(action, data, callback) {
        chrome.runtime.sendMessage({ action, data }, callback);
    }

    function updateCountdownDisplay() {
        sendMessage("getCountdown", null, function (response) {
            const countdownDisplay = document.getElementById("timerDisplay");
            console.log(response);
            if (response && response.countdown !== undefined) {
                setBreakTime(response.countdown);
            } else {
                countdownDisplay.innerText = "Timer: N/A";
            }
        });
    }

    function setBreakTime(seconds) {
        timerSeconds = seconds;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        document.getElementById("timer").textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    
    document.getElementById("btn10").addEventListener("click", function () {
        setBreakTime(10*60);
    });

    document.getElementById("btn20").addEventListener("click", function () {
        setBreakTime(20*60);
    });

    document.getElementById("btn30").addEventListener("click", function () {
        setBreakTime(30*60);
    });

    // Add a click event listener to the button
    document
        .getElementById("timerButton")
        .addEventListener("click", function () {

            sendMessage("startCountdown", { seconds: timerSeconds });

            document.getElementById("timerButton").disabled = true;
        });

    updateCountdownDisplay();

    setInterval(updateCountdownDisplay, 1000);
});
