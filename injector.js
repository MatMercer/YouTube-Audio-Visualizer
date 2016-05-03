chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        window.postMessage({
            type: "FROM_PAGE",
            text: "Hello from the webpage!"
        }, "*");
    });

//all the files SHOULD be added to web_accessible_resources in manifest file
//add all the script files to the html element

//used to get the text javascript code from files and
//add it to the script dom element

function setupScripts() {
    var text = null;
    var script = document.createElement("script");
    $.get(chrome.extension.getURL("pixi.js"),
        function(data) {
            text = "" + data;
            script.appendChild(document.createTextNode(text));
            $.get(chrome.extension.getURL("jquery.js"),
                function(data) {
                    text = "" + data;
                    script.appendChild(document.createTextNode(text));
                    $.get(chrome.extension.getURL("ytav.js"),
                        function(data) {
                            text = "" + data;
                            script.appendChild(document.createTextNode(text));
                            document.head.appendChild(script);
                        });
                });
        });
}
setupScripts();
