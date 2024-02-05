document.addEventListener("DOMContentLoaded", function () {
    let defaultTime = 5;
    let programStatus;
    const durationButtons = document.querySelectorAll(".duration-button");

    function checkStatus() {
        switch (programStatus) {
            case "NOT_STARTED":
                durationButtons.forEach((button) => (button.disabled = false));
                document.getElementById("timerButton").disabled = false;

                document.getElementById("pauseResumeButton").disabled = true;
                document.getElementById("resetButton").disabled = true;
                break;

            case "PLAYING":
                document.getElementById("pauseResumeButton").disabled = false;
                document.getElementById("pauseResumeButton").innerText = "Pause";
                document.getElementById("resetButton").disabled = false;
                
                document.getElementById("timerButton").disabled = true; 
                durationButtons.forEach((button) => (button.disabled = true));
                break;

            case "PAUSED":
                document.getElementById("pauseResumeButton").disabled = false;
                document.getElementById("pauseResumeButton").innerText = "Resume";
                document.getElementById("resetButton").disabled = false;

                document.getElementById("timerButton").disabled = true;
                durationButtons.forEach((button) => (button.disabled = true));
                break;

            default:
                alert("bug");
        }
    }

    function sendMessage(action, data, callback) {
        chrome.runtime.sendMessage({ action, data }, callback);
    }

    function updateCountdownDisplay() {
        sendMessage("getCountdown", null, function (response) {
            if (response) {
                if(response.countdown !== undefined) insertTime(response.countdown);

                programStatus = response.programStatus;
                checkStatus();
            }
        });
    }

    function insertTime(seconds) {
        if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
            alert("Invalid input");
            return;
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const formattedSeconds =
            remainingSeconds < 10
                ? `0${remainingSeconds}`
                : `${remainingSeconds}`;

        document.getElementById(
            "timerDisplay"
        ).innerText = `${formattedMinutes}:${formattedSeconds}`;
    }

    function handleButtonClick(button) {
        defaultTime = parseInt(button.dataset.duration, 10);
        insertTime(defaultTime);
    }

    durationButtons.forEach((button) => {
        button.onclick = () => handleButtonClick(button);
    });

    document
        .getElementById("pauseResumeButton")
        .addEventListener("click", function () {
            if (programStatus === "PAUSED") {
                sendMessage("resumeCountdown");
            } else if (programStatus === "NOT_STARTED") {
                sendMessage("startCountdown", { seconds: defaultTime });
            } else {
                sendMessage("pauseCountdown");
            }
            checkStatus();
        });

    document
        .getElementById("resetButton")
        .addEventListener("click", function () {
            sendMessage("resetCountdown");
            insertTime(defaultTime);
            checkStatus();
        });

    document
        .getElementById("timerButton")
        .addEventListener("click", function () {
            sendMessage("startCountdown", { seconds: defaultTime });
            checkStatus();
        });

    updateCountdownDisplay();
    setInterval(updateCountdownDisplay, 100);
});
