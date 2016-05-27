//the listeners used to detect
//the popup menu changes and
//actions
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        window.postMessage({
            action: request.action,
            content: request.data
        }, "*");

        sendResponse("Message received...");  
    });
