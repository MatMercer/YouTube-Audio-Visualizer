$(document).ready(function () {
//injects a span, faking a video load
    setTimeout(function() {
        $("#fake").append($("<span>", {class: "ytp-time-current"}));
        //adds a function to the button
        $("button").click(vis.nextScene);
    }, 1000);
})
