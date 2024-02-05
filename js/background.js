let countdown;
let countdownInterval;
let countdownStart;
let paused = false;
let remainingTime;
let programStatus = "NOT_STARTED";

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
    countdownStart = performance.now();
    programStatus = "PLAYING";

    countdownInterval = setInterval(function () {
        if (programStatus !== "PAUSED") { 
            const elapsedMilliseconds = performance.now() - countdownStart;
            const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
            countdown = seconds - elapsedSeconds;

            if (countdown <= 0) {
                closeAllTabsAndOpenNewTab();
                clearCountdown();
            }
        }
    }, 200);
}

function pauseCountdown() {
    clearInterval(countdownInterval);
    remainingTime = countdown;
    programStatus = "PAUSED";
}

function resumeCountdown() {
    clearInterval(countdownInterval); 
    if (remainingTime > 0) {
        countdownStart = performance.now();
        startCountdown(remainingTime);
    } else {
        // Handle case when the remaining time is already expired
        closeAllTabsAndOpenNewTab();
        clearCountdown();
    }
    programStatus = "PLAYING";
}

function clearCountdown() {
    clearInterval(countdownInterval);
    countdown = undefined;
    remainingTime = undefined;
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
        sendResponse({ countdown: getCountdown(), programStatus: programStatus });
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
