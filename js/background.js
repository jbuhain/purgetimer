let countdown;
let countdownInterval;
let countdownStart;
let paused = false;
let remainingTime;

function closeAllTabsAndOpenNewTab() {
    // Get all tabs
    chrome.tabs.query({}, function (tabs) {
        // Close each tab
        tabs.forEach(function (tab) {
            chrome.tabs.remove(tab.id);
        });
    });
    // Open a new tab
    chrome.tabs.create({});
}

function startCountdown(seconds) {
    countdown = seconds;
    countdownStart = performance.now();

    countdownInterval = setInterval(function () {
        if (!paused) {
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
    console.log("Pausing countdown", + countdown);
    clearInterval(countdownInterval); // Clear existing interval
    paused = true;
    remainingTime = countdown; // Store remaining time
}

function resumeCountdown() {
    paused = false;
    clearInterval(countdownInterval); // Clear existing interval
    if (remainingTime > 0) {
        countdownStart = performance.now();
        startCountdown(remainingTime);
    } else {
        // Handle case when the remaining time is already expired
        closeAllTabsAndOpenNewTab();
        clearCountdown();
    }
}

function clearCountdown() {
    clearInterval(countdownInterval);
    countdown = undefined;
    remainingTime = undefined; // Clear remaining time
    paused = false;
    countdownStart = undefined;
}

function getCountdown() {
    return countdown;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "startCountdown") {
        startCountdown(request.data.seconds);
    } else if (request.action === "getCountdown") {
        sendResponse({ countdown: getCountdown(), paused: paused });
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
