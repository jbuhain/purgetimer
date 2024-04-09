let countdown;
let countdownInterval;
let countdownStart;
let sessionTime;
let programStatus = "NOT_STARTED";

function createNewTab() {
    chrome.tabs.create({});
}

function pauseCountdown() {
    clearInterval(countdownInterval);
    programStatus = "PAUSED";
}

function clearCountdown() {
    clearInterval(countdownInterval);
    countdown = undefined;
    countdownStart = undefined;
    programStatus = "NOT_STARTED";
}

function resetSessionTime() {
    sessionTime = 0;
}

function getCountdown() {
    return countdown;
}
function getSessionTime() {
    return sessionTime;
}
function getProgramStatus() {
    return programStatus;
}

function removePurgedTab() {
    chrome.tabs.query({}, function (allTabs) {
        const purgedTab = allTabs.find(tab => tab.title === "purge-timer//purged");

        if (purgedTab) {
            chrome.tabs.remove(purgedTab.id, function () {
                console.log("Purged Page closed");
            });
        }
    });
}

function startCountdown(seconds) {
    countdown = seconds;
    sessionTime = seconds;
    countdownStart = Date.now();
    programStatus = "PLAYING";

    countdownInterval = setInterval(function () {
        if (programStatus !== "PAUSED") {
            const now = Date.now();
            const elapsedMilliseconds = now - countdownStart;
            const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
            countdown = seconds - elapsedSeconds;
            if (countdown <= 0) {
                closeAllTabs();
                clearCountdown();
                // openLinks();
                openPurgedPage();
            }
        }
    }, 1000);
}

function openPurgedPage() {
    chrome.tabs.query({}, function (allTabs) {
        const purgedTab = allTabs.filter(tab => tab.title === "purge-timer//purged");

        // if (purgedTab.length > 0) {
        //     chrome.tabs.update(purgedTab[0].id, { url: 'purged.html' }, function (tab) {
        //         // console.log("Purged Page refreshed");
        //     });
        //     chrome.tabs.update(purgedTab[0].id, { active: true });
        //     chrome.windows.update(purgedTab[0].windowId, { focused: true });
        //     // console.log("purged page found");
        // } else {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                const currentIndex = tabs[0].index;
                chrome.tabs.create({ url: 'purged.html', active: true, index: currentIndex + 1 }, function (tab) {
                    console.log("New purged page created");
                    chrome.windows.update(tab.windowId, { focused: true });
                });
            });
            
        // }
    });
    console.log("open purged page completed");
}

function closeAllTabs() {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            chrome.tabs.remove(tab.id);
        });
    });
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

// Using this alarm to prevent chrome from stopping this program.
// Important!
// TODO: Maybe add this alarm only when timer is running. But browser might slow down timer for now.
chrome.alarms.create({ periodInMinutes: 0.25 });
chrome.alarms.onAlarm.addListener(() => {
    console.log("Sending this message to keep timer running");
}); 

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "startCountdown") {
        startCountdown(request.data.seconds);
    } else if (request.action === "getCountdown") {
        sendResponse({
            countdown: getCountdown(),
            programStatus: getProgramStatus(),
        });
    } else if (request.action === "clearCountdown") {
        clearCountdown();
    } else if (request.action === "pauseCountdown") {
        pauseCountdown();
    } else if (request.action === "resumeCountdown") {
        resumeCountdown();
    } else if (request.action === "resetCountdown") {
        clearCountdown();
        resetSessionTime();
    } else if (request.action === "removePurgedTab") {
        removePurgedTab();
    } else if (request.action === "getSessionTime") {
        sendResponse({
            sessionTime: getSessionTime(),
            programStatus: getProgramStatus(),
        });
    }
});
