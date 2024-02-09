document.addEventListener("DOMContentLoaded", function () {
    let defaultTime = 0;
    let programStatus;
    function checkStatus() {
        switch (programStatus) {
            case "NOT_STARTED":
                document.getElementById("topHeading").innerText = "purge timer";
                document.getElementById("pauseResumeButton").disabled = false;
                document.getElementById("pauseResumeButton").innerText = "start";
                document.getElementById("timerInput").style.display = "block";
                document.getElementById("timerDisplay").style.display = "none";

                document.getElementById("resetButton").disabled = true;
                document.getElementById("resetButton").style.display = "none";

                break;

            case "PLAYING":
                document.getElementById("topHeading").innerText = "purge happens in";
                document.getElementById("pauseResumeButton").disabled = false;
                document.getElementById("pauseResumeButton").innerText = "pause";
                document.getElementById("resetButton").disabled = false;
                document.getElementById("resetButton").style.display = "block";
                document.getElementById("timerInput").style.display = "none";
                document.getElementById("timerDisplay").style.display = "block";

                break;

            case "PAUSED":
                document.getElementById("topHeading").innerText = "timer paused";
                document.getElementById("pauseResumeButton").disabled = false;
                document.getElementById("pauseResumeButton").innerText = "resume";
                document.getElementById("resetButton").disabled = false;
                document.getElementById("resetButton").style.display = "block";
                document.getElementById("timerInput").style.display = "none";
                document.getElementById("timerDisplay").style.display = "block";

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
                
                if(programStatus !== response.programStatus){
                    programStatus = response.programStatus;
                    checkStatus();
                }
            }
        });
    }

    function insertTime(seconds) {
        if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
            return false;
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const formattedSeconds =
            remainingSeconds < 10
                ? `0${remainingSeconds}`
                : `${remainingSeconds}`;


        // TODO: split this method into two parts. Format and one for setting text. 
        document.getElementById(
            "timerDisplay"
        ).innerText = `${formattedMinutes}:${formattedSeconds}`;
        return true;
    }

    document
        .getElementById("pauseResumeButton")
        .addEventListener("click", function () {
            if (programStatus === "PAUSED") {
                sendMessage("resumeCountdown");
            } else if (programStatus === "NOT_STARTED") {
                if (defaultTime > 0){
                    sendMessage("startCountdown", { seconds: defaultTime });
                }
                else {
                    alert("Invalid input. Set the timer > 0 seconds.")
                }
            } else {
                sendMessage("pauseCountdown");
            }
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

        if(timerInput.value==="00:00") {
            timerInput.value = "";
        }
        
        const minutes = parseInt(timerInput.value.slice(0, 2));
        const seconds = parseInt(timerInput.value.slice(3));



        defaultTime = minutes * 60 + seconds;
        // TODO:format the value given the method int insertTime() and set it to defaultTime
        insertTime(defaultTime);

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
