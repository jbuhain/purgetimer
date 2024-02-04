let initial_time = 5;
ticking = false;

document.addEventListener("DOMContentLoaded", function () {
    // Function to close all tabs and open a new one


    function checkStatus() {
        if(!ticking) return;
        
        document.getElementById("timerButton").disabled = true;

        // if(paused) return;
        durationButtons.forEach(function (button) {
            button.disabled = true;
        });
        
    }

    function sendMessage(action, data, callback) {
        chrome.runtime.sendMessage({ action, data }, callback);
    }

    function updateCountdownDisplay() {
        sendMessage("getCountdown", null, function (response) {
            // console.log(response);
            if (response && response.countdown !== undefined) {
                insertTime(response.countdown);
                ticking = true;
                checkStatus();
            }
        });
    }

    function insertTime(seconds) {
        if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
            // Handle invalid input
            alert("Invalid input");
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        // Add leading zeros if needed
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const formattedSeconds =
            remainingSeconds < 10
                ? `0${remainingSeconds}`
                : `${remainingSeconds}`;

        let countdownDisplay = document.getElementById("timerDisplay");
        countdownDisplay.innerText = `${formattedMinutes}:${formattedSeconds}`;
    }

    // Get all buttons with the class "duration-button"
    const durationButtons = document.querySelectorAll(".duration-button");

    // Function to handle button click
    function handleButtonClick(button) {
        initial_time = parseInt(button.dataset.duration, 10);
        insertTime(initial_time);
    }

    // Add onclick attribute to each button
    durationButtons.forEach(function (button) {
        button.onclick = function () {
            handleButtonClick(button);
        };
    });

    // Add a click event listener to the button
    document
        .getElementById("timerButton")
        .addEventListener("click", function () {
            // Set a timer for 5 seconds (you can adjust the time as needed)

            sendMessage("startCountdown", { seconds: initial_time });
            ticking = true;
            checkStatus();
        });

    updateCountdownDisplay();

    setInterval(updateCountdownDisplay, 100);
});
