$(document).ready(function () {
//injects a span, faking a video load
    setTimeout(function() {
        $("#fake").append($("<span>", {class: "ytp-time-current"}));
    }, 1000);
})
