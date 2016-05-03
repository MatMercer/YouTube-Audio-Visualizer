//the requests are made with google chrome
//API to work with the page
function test() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            greeting: "hello"
        }, function(response) {
            console.log(response.farewell);
        });
    });
    console.log("test...");
}
$(document).ready(function() {
    $("#next-visualizer-button").click(test);
});
