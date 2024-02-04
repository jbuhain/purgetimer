let countdown;
let countdownInterval;

function closeAllTabsAndOpenNewTab() {
    // Get all tabs
    chrome.tabs.query({}, function (tabs) {
        // Close each tab
        tabs.forEach(function (tab) {
            chrome.tabs.remove(tab.id);
        });
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
    });
    // Open a new tab
    chrome.tabs.create({});
}

function startCountdown(seconds) {
    countdown = seconds;
<<<<<<< Updated upstream
    console.log("1st part: initially says " + countdown + " seconds");
    // Show countdown
=======
    countdownStart = performance.now();

>>>>>>> Stashed changes
    countdownInterval = setInterval(function () {
        const elapsedMilliseconds = performance.now() - countdownStart;
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
        countdown = seconds - elapsedSeconds;

        if (countdown <= 0) {
            closeAllTabsAndOpenNewTab();
            clearCountdown();
        }

    }, 1000);
}

function clearCountdown() {
    clearInterval(countdownInterval);
    countdown = undefined;
}

function getCountdown() {
    return countdown;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "startCountdown") {
        console.log("Start Countdown");
        // console.log(request);
        startCountdown(request.data.seconds);
    } else if (request.action === "getCountdown") {
        // console.log("Get Countdown");
        sendResponse({ countdown: getCountdown() });
    } else if (request.action === "clearCountdown") { // for cancelling
        // console.log("Clear Countdown");
        clearCountdown();
    }
});
