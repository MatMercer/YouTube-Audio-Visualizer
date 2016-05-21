//receives a message and parse it to visualizer actions
window.addEventListener("message", function(event) {
    //we only accept messages from ourselves
    if (event.source != window)
        return;
    switch(event.data.action) {
        case "nextScene":
            vis.nextScene();
            break;
        case "previousScene":
            vis.previousScene();
            break;
        default:
            break;
    }
}, false);

//startup the visualizer
$(document).ready(function() {
    vis = new audioVisualizer(640, 360, "#player", "video", "#player-api");
    vis.init();
    vis.render();

    //a listener to check if a new video has been loaded
    //if yes, focus on it
    $(document).bind("DOMNodeInserted", function(e) {
        //checks for the video time current time text
        //it is better to use this element because
        //it is added every time
        if ($(e.target).get(0) == $("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div > span.ytp-time-current").get(0)) {
            scrollToVideo();
            //unbind to prevent unused processing
            $(document).unbind("DOMNodeInserted");
        }
    });
});
