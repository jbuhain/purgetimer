let countdown;
let countdownInterval;
let countdownStart;
let sessionTime;
let programStatus = "NOT_STARTED";
const purgedTabTitle = "purge-timer//purged";
const purgedURL = "purged.html";

function createTab (url) {
    return new Promise(resolve => {
        chrome.tabs.create({url}, async tab => {
            chrome.tabs.onUpdated.addListener(function listener (tabId, info) {
                if (info.status === 'complete' && tabId === tab.id) {
                    chrome.tabs.onUpdated.removeListener(listener);
                    resolve(tab);
                }
            });
        });
    });
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
        const purgedTab = allTabs.find(tab => tab.title === purgedTabTitle);

        if (purgedTab) {
            chrome.tabs.remove(purgedTab.id, function () {
                // console.log("Purged Page closed");
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
                // closeAllTabs();
                clearCountdown();
                // openLinks();
                openPurgedPage();
            }
        }
    }, 1000);
}

function closeAllTabsExceptPurged() {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            if( tab.title !== purgedTabTitle) {
                chrome.tabs.remove(tab.id);
            }
        });
    });
}

async function openPurgedPage() {
    try {
        const allTabs = await new Promise((resolve, reject) => {
            chrome.tabs.query({}, tabs => resolve(tabs));
        });

        const purgedTab = allTabs.find(tab => tab.title === purgedTabTitle);

        if (purgedTab) {
            await new Promise((resolve, reject) => {
                chrome.tabs.update(purgedTab.id, { url: purgedURL }, () => resolve());
            });
            closeAllTabsExceptPurged();
            await new Promise((resolve, reject) => {
                chrome.tabs.update(purgedTab.id, { active: true }, () => resolve());
            });
            await new Promise((resolve, reject) => {
                chrome.windows.update(purgedTab.windowId, { focused: true }, () => resolve());
            });
        } else {
            const tab = await createTab(purgedURL);
            closeAllTabsExceptPurged();
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function closeAllTabsExceptStartPage() {
    console.log("deleting all tabs except start");
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            if( tab.title !== "purge-timer//started") {
                chrome.tabs.remove(tab.id);
            }
        });
    });
}

function removeStartTab() {
    chrome.tabs.query({}, function (allTabs) {
        const purgedTab = allTabs.find(tab => tab.title === "purge-timer//started");

        if (purgedTab) {
            chrome.tabs.remove(purgedTab.id, function () {
                // console.log("Start Page closed");
            });
        }
    });
}

function openSessionTabs() {
    chrome.storage.session.get('SessionTabs', function (result) {
        let links = result.SessionTabs || [];
        console.log('Retrieved links:', links);
        // Open each link in a separate tab
        links.forEach(function (link, index) {
            // Ensure that the link includes the protocol (e.g., "http://" or "https://")
            if (!link.match(/^https?:\/\//i)) {
                // If the link doesn't include the protocol, prepend "http://"
                link = "http://" + link;
            }
            // Open the link in a new tab
            chrome.tabs.create({ url: link }, function(tab) {
                // Check if this is the last link to be opened
                if (index === links.length - 1) {
                    // Call removePurgedTab() after all links have been opened
                    removeStartTab();
                }
            });
        });
    });
}

async function openStartPage() {
    try {
        const allTabs = await new Promise((resolve, reject) => {
            chrome.tabs.query({}, tabs => resolve(tabs));
        });

        const purgedTab = allTabs.find(tab => tab.title === "purge-timer//started");

        if (purgedTab) {
            await new Promise((resolve, reject) => {
                chrome.tabs.update(purgedTab.id, { url: "start.html" }, () => resolve());
            });
            closeAllTabsExceptStartPage();
            await new Promise((resolve, reject) => {
                chrome.tabs.update(purgedTab.id, { active: true }, () => resolve());
            });
            await new Promise((resolve, reject) => {
                chrome.windows.update(purgedTab.windowId, { focused: true }, () => resolve());
            });
        } else {
            const tab = await createTab("start.html");
            closeAllTabsExceptStartPage();
        }
    } catch (error) {
        console.error("Error:", error);
    }
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
// TODO: Maybe add this alarm only when timer is running.
chrome.alarms.create({ periodInMinutes: 0.25 });
chrome.alarms.onAlarm.addListener(() => {
    console.log("Sending this message to keep timer running");
}); 

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "startCountdown") {
        startCountdown(request.data.seconds);
        if (request.data.mode) {
            openStartPage();
        }
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
        openSessionTabs();
    } else if (request.action === "removePurgedTab") {
        removePurgedTab();
    } else if (request.action === "getSessionTime") {
        sendResponse({
            sessionTime: getSessionTime(),
            programStatus: getProgramStatus(),
        });
    }
});
