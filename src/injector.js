//all the files SHOULD be added to web_accessible_resources in manifest file
//add all the script files to the html element

//inject all the extension content used to work
function injectContent() {
    $("<script>").attr({
        src: chrome.extension.getURL("/lib/pixi/bin/pixi.min.js"),
        type: "text/javascript"
    }).appendTo("head");

    $("<script>").attr({
        src: chrome.extension.getURL("/lib/jquery/dist/jquery.min.js"),
        type: "text/javascript"
    }).appendTo("head");

    $("<script>").attr({
        src: chrome.extension.getURL("/lib/localstorage/lockr.min.js"),
        type: "text/javascript"
    }).appendTo("head");

    $("<script>").attr({
        src: chrome.extension.getURL("/src/settings/settings.js"),
        type: "text/javascript"
    }).appendTo("head");

    $("<script>").attr({
        src: chrome.extension.getURL("/src/ytav.js"),
        type: "text/javascript"
    }).appendTo("head");

    $("<script>").attr({
        src: chrome.extension.getURL("/src/listeners/ytav_listeners.js"),
        type: "text/javascript"
    }).appendTo("head");

    $.get(chrome.extension.getURL("/src/container.html"), function(data){
        $("#player").prepend($.parseHTML(data));
    });

    containerStyle = $("<link>");
    containerStyle.attr("rel", "stylesheet");
    containerStyle.attr("type", "text/css");
    containerStyle.attr("href", chrome.extension.getURL("/src/container.css"));
    $("head").append(containerStyle);

    $("<script>").attr({
        src: chrome.extension.getURL("/src/container.js"),
        type: "text/javascript"
    }).appendTo("head");
}

injectContent();
