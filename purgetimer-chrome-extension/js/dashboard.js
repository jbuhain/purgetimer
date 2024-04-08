let initialized = false;

document.addEventListener("DOMContentLoaded", function () {


    let editor = CodeMirror.fromTextArea(document.getElementById("codeMirrorTextarea"), {
        lineNumbers: true, 
    });

    function saveLinks(links) {
        chrome.storage.local.set({ 'links': links }, function() {
            // console.log('Links saved:', links);
        });
    }

    // retrieve links from local storage
    function getLinks(callback) {
        chrome.storage.local.get('links', function(result) {
            let links = result.links || [];
            // console.log('Retrieved links:', links);
            callback(links);
        });
    }

    // update links and save them to storage
    function updateLinks(newLinks) {
        getLinks(function(links) {
            links = newLinks;
            saveLinks(links);
        });
    }

    // load saved links into the textarea on page load
    getLinks(function(links) {
        let text = links.join('\n'); 
        editor.setValue(text); 
        previousState = text; 
        initialized = true;
    });

    editor.on("change", function() {
        let currentState = editor.getValue();
        if (initialized && currentState !== previousState) {
            document.getElementById("saveLinksButton").removeAttribute("disabled");
            document.getElementById("revertChangesButton").removeAttribute("disabled");
        } else {
            document.getElementById("saveLinksButton").setAttribute("disabled", "disabled");
            document.getElementById("revertChangesButton").setAttribute("disabled", "disabled");
        }
    });

    document.getElementById("saveLinksButton").setAttribute("disabled", "disabled");

    document.getElementById("saveLinksButton").addEventListener("click", function () {
        let newLinks = editor.getValue().split('\n'); 
        updateLinks(newLinks); 
        previousState = editor.getValue(); 
        document.getElementById("saveLinksButton").setAttribute("disabled", "disabled");
        document.getElementById("revertChangesButton").setAttribute("disabled", "disabled");
    });

    document.getElementById("revertChangesButton").addEventListener("click", function () {
        // load saved links into the textarea on page load
        getLinks(function(links) {
            let text = links.join('\n'); 
            editor.setValue(text); 
            previousState = text; 
            initialized = true;
        });
    });
});
