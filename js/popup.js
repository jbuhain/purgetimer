document.addEventListener("DOMContentLoaded", function () {
    let defaultTime = 5;
    let programStatus;
    const durationButtons = document.querySelectorAll(".duration-button");

    function checkStatus() {
        switch (programStatus) {
            case "NOT_STARTED":
                durationButtons.forEach((button) => {
                    button.disabled = false;
                    button.style.display = "none"; // switch to inline-block later.. currently hiding for UI development
                });
                document.getElementById("pauseResumeButton").disabled = false;
                document.getElementById("pauseResumeButton").innerText = "start";

                document.getElementById("resetButton").disabled = true;
                document.getElementById("resetButton").style.display = "none";


                break;

            case "PLAYING":
                document.getElementById("pauseResumeButton").disabled = false;
                document.getElementById("pauseResumeButton").innerText = "pause";
                document.getElementById("resetButton").disabled = false;
                document.getElementById("resetButton").style.display = "block";

                
                durationButtons.forEach((button) => {
                    button.disabled = true;
                    button.style.display = "none";
                });
                break;

            case "PAUSED":
                document.getElementById("pauseResumeButton").disabled = false;
                document.getElementById("pauseResumeButton").innerText = "resume";
                document.getElementById("resetButton").disabled = false;
                document.getElementById("resetButton").style.display = "block";

                

                durationButtons.forEach((button) => {
                    button.disabled = true;
                    button.style.display = "none";
                });
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


    document.getElementById("timerInput").addEventListener("input", function () {
        // Remove non-numeric characters and limit the input length to 4 characters
        timerInput.value = timerInput.value.replace(/\D/g, '');

        // Pad the input value with zeros from the right side until length is 4
        timerInput.value = timerInput.value.padStart(4, '0');

        // Keep only the last 4 digits
        timerInput.value = timerInput.value.slice(-4);

        // Insert colon
        if (timerInput.value.length >= 3) {
            timerInput.value = timerInput.value.slice(0, -2) + ':' + timerInput.value.slice(-2);
        }
      });

    document
        .getElementById("resetButton")
        .addEventListener("click", function () {
            sendMessage("resetCountdown");
            insertTime(defaultTime);
            checkStatus();
        });

    updateCountdownDisplay();
    setInterval(updateCountdownDisplay, 100);
});
