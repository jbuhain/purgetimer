
document.addEventListener("DOMContentLoaded", function () {

    function sendMessage(action, data, callback) {
        chrome.runtime.sendMessage({ action, data }, callback);
    }
    
    function updateSessionTime(seconds) {

        if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
            document.getElementById(
                "sessionTime"
            ).innerText = 'N/A';
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
            "sessionTime"
        ).innerText = `${formattedMinutes}m ${formattedSeconds}s`;

    }

    sendMessage("getSessionTime", null, function (response) {
        document.getElementById(
            "sessionTime"
        ).innerText = 'n/a';
        if (response) {
            console.log("response found for session time", response.sessionTime);
            if (response.sessionTime !== undefined) {
                updateSessionTime(response.sessionTime);
            }
        }
    });

    

});


