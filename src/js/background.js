let countdown;
let countdownInterval;
let countdownStart;
let programStatus = "NOT_STARTED";

// Using this alarm to prevent chrome from stopping this program.
// Important!
chrome.alarms.create({ periodInMinutes: 0.25 });
chrome.alarms.onAlarm.addListener(() => {
    console.log("Waking up program to keep timer running");
});

function closeAllTabsAndOpenNewTab() {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            chrome.tabs.remove(tab.id);
        });
    });
    chrome.tabs.create({});
}

function startCountdown(seconds) {
    countdown = seconds;
    countdownStart = Date.now();
    programStatus = "PLAYING";

    countdownInterval = setInterval(function () {
        if (programStatus !== "PAUSED") {
            const now = Date.now();
            const elapsedMilliseconds = now - countdownStart;
            const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
            countdown = seconds - elapsedSeconds;
            if (countdown <= 0) {
                closeAllTabsAndOpenNewTab();
                clearCountdown();
            }
        }
    }, 1000);
}

function pauseCountdown() {
    clearInterval(countdownInterval);
    programStatus = "PAUSED";
}

function resumeCountdown() {
    clearInterval(countdownInterval); // ensure no lingering interval function for countdown
    if (countdown > 0) {
        startCountdown(countdown);
    } else {
        // Handle emergency case when the remaining time is already expired
        closeAllTabsAndOpenNewTab();
        clearCountdown();
    }
    programStatus = "PLAYING";
}

function clearCountdown() {
    clearInterval(countdownInterval);
    countdown = undefined;
    countdownStart = undefined;
    programStatus = "NOT_STARTED";
}

function getCountdown() {
    return countdown;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "startCountdown") {
        startCountdown(request.data.seconds);
    } else if (request.action === "getCountdown") {
        sendResponse({
            countdown: getCountdown(),
            programStatus: programStatus,
        });
    } else if (request.action === "clearCountdown") {
        clearCountdown();
    } else if (request.action === "pauseCountdown") {
        pauseCountdown();
    } else if (request.action === "resumeCountdown") {
        resumeCountdown();
    } else if (request.action === "resetCountdown") {
        clearCountdown();
    }
});
