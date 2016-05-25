//a local object to be
//transfered through javascript
//events & chrome extension events
var localObj;

//the listeners used to detect
//the popup menu changes and
//actions
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        window.postMessage({
            action: request.action,
            content: request.data
        }, "*");

        sendResponse(localObj);
    });

//a listener to recieve
//page scope data
window.addEventListener("message", function(event) {
    //we only accept messages from ourselves
    if (event.source != window)
        return;
    switch (event.data.action) {
        case "sendSettings":
            localObj = JSON.parse(event.data.content);
        default:
            break;
    }
}, false);
