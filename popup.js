//the requests are made with google chrome
//API to work with the page scope
function nextScene() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "nextScene",
            data: null
        }, function(response) {
            console.log("Response: " + response);
        });
    });
}
$(document).ready(function() {
    $("#next-visualizer-button").click(nextScene);
});
