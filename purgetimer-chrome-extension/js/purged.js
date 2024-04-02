
document.addEventListener("DOMContentLoaded", function () {
    function updateSessionTime(seconds) {

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
            "sessionTime"
        ).innerText = `${formattedMinutes}m ${formattedSeconds}s`;


        // document.getElementById("sessionTime").textContent = receivedSessionTime;
    }
    
    function sendMessage(action, data, callback) {
        chrome.runtime.sendMessage({ action, data }, callback);
    }
    sendMessage("getSessionTime", null, function (response) {
        console.log("sent");
        if (response) {
            console.log("response found for session time");
            if(response.sessionTime !== undefined){
                updateSessionTime(response.sessionTime);
            } 
        }
    });
    
    console.log("booted");
    
});


