document.addEventListener("DOMContentLoaded", function () {
    // Function to close all tabs and open a new one
    function closeAllTabsAndOpenNewTab() {
        // Get all tabs
        chrome.tabs.query({}, function (tabs) {
            // Close each tab
            tabs.forEach(function (tab) {
                chrome.tabs.remove(tab.id);
            });

            // Open a new tab
            chrome.tabs.create({});
        });
    }

    // Add a click event listener to the button
    document
        .getElementById("clickMeButton")
        .addEventListener("click", function () {
            // Set a timer for 5 seconds (you can adjust the time as needed)
            const timerSeconds = 5;

            // Disable the button during the timer to prevent multiple clicks
            document.getElementById("clickMeButton").disabled = true;

            // Display the initial countdown
            document.getElementById(
                "timerDisplay"
            ).innerText = `Timer: ${timerSeconds}`;

            // Show a countdown (optional)
            let countdown = timerSeconds;
            const countdownInterval = setInterval(function () {
                console.log(countdown);
                countdown--;

                // Update the countdown display
                document.getElementById(
                    "timerDisplay"
                ).innerText = `Timer: ${countdown}`;

                if (countdown <= 0) {
                    // When the timer reaches zero, close all tabs and open a new one
                    closeAllTabsAndOpenNewTab();

                    // Enable the button again
                    document.getElementById("clickMeButton").disabled = false;

                    // Clear the countdown interval
                    clearInterval(countdownInterval);
                }
            }, 1000);
        });
});
