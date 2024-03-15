document.addEventListener("DOMContentLoaded", function () {

    var editor = CodeMirror.fromTextArea(document.getElementById("codeMirrorTextarea"), {
        lineNumbers: true, // Enable line numbers
    });

    document.getElementById("saveLinksButton").addEventListener("click", function () {
        var text = editor.getValue();
        console.log(text); 
    }); 


    // Function to save links to Chrome extension storage
    function saveLinks(links) {
        chrome.storage.local.set({ 'links': links }, function() {
            console.log('Links saved:', links);
        });
    }

    // Function to retrieve links from Chrome extension storage
    function getLinks(callback) {
        chrome.storage.local.get('links', function(result) {
            var links = result.links || [];
            console.log('Retrieved links:', links);
            callback(links);
        });
    }

    // Function to update links and save them to storage
    function updateLinks(newLinks) {
        getLinks(function(links) {
            links = newLinks;
            saveLinks(links);
        });
    }


    // Load saved links into the textarea on page load
    getLinks(function(links) {
        var text = links.join('\n'); // Convert links array to a string with each link on a new line
        editor.setValue(text); // Set the value of the CodeMirror textarea to the saved links
    });

    document.getElementById("saveLinksButton").addEventListener("click", function () {
        var newLinks = editor.getValue().split('\n'); // Get the content of the textarea and split it into an array of links
        updateLinks(newLinks); // Update the links in storage
        showMessage("Links saved!", false); // Display a message indicating that links are saved
    }); 


    // Function to retrieve links from Chrome extension storage and open them in separate tabs
    function openLinks() {
        chrome.storage.local.get('links', function(result) {
            var links = result.links || [];
            console.log('Retrieved links:', links);
            // Open each link in a separate tab
            links.forEach(function(link) {
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

    document.getElementById("openLinksButton").addEventListener("click", function () {
        openLinks();
    });

    function showMessage(message, isError = false) {
        var messageElement = document.getElementById("saveLinksMessage");
        messageElement.textContent = message;
        messageElement.style.color = isError ? "red" : "green";
    }

    // Event listener for changes in the textarea content
    editor.on("change", function() {
        showMessage("Changes detected! Don't forget to save.", true); // Display a message indicating that changes have been made
    });
});