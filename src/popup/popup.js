//the requests are made with google chrome
//API to work with the page scope
function sendAction(event) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: event.data.action,
            data: event.data.data
        }, function(response) {
            console.log("Response: " + response);
        });
    });
}

//setup the buttons to send actions
//via events
$(document).ready(function() {
    $("#next-visualizer-button").click({
        action: "nextScene",
        data: null
    }, sendAction);
    $("#previous-visualizer-button").click({
        action: "previousScene",
        data: null
    }, sendAction);
});
