
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

    // retrieves links from local storage and opens them in separate tabs
    function openLinks() {
        chrome.storage.local.get('links', function (result) {
            let links = result.links || [];
            console.log('Retrieved links:', links);
            // Open each link in a separate tab
            links.forEach(function (link) {
                // Ensure that the link includes the protocol (e.g., "http://" or "https://")
                if (!link.match(/^https?:\/\//i)) {
                    // If the link doesn't include the protocol, prepend "http://"
                    link = "http://" + link;
                }
                // Open the link in a new tab
                chrome.tabs.create({ url: link });
            });
        });
    }

    document
        .getElementById("openLinksButton")
        .addEventListener("click", function () {
            openLinks();
        });

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


