//the local settings copy of the popup
var st = null;

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
            if (event.data.action === "getSettings") {
                st = response;
                console.log(st);
            }
        });
    });
}

//setup the buttons to send actions
//via events
$(document).ready(function() {
    //get the settings
    sendAction({
        data: {
            action: "getSettings",
            data: null
        }
    });

    $("#next-visualizer-button").click({
        action: "nextScene",
        data: null
    }, sendAction);
    $("#previous-visualizer-button").click({
        action: "previousScene",
        data: null
    }, sendAction);
});
