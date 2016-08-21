//all the files SHOULD be added to web_accessible_resources in manifest file
//add all the script files to the html element

//inject all the extension content used to work
function injectContent() {
    $("<script>").attr({
        src: chrome.extension.getURL("/lib/pixi.min.js"),
        type: "text/javascript"
    }).appendTo("head");

    $("<script>").attr({
        src: chrome.extension.getURL("/lib/jquery.min.js"),
        type: "text/javascript"
    }).appendTo("head");

    containerStyle = $("<link>");
    containerStyle.attr("rel", "stylesheet");
    containerStyle.attr("type", "text/css");
    containerStyle.attr("href", chrome.extension.getURL("/lib/jquery-ui.css"));
    $("head").append(containerStyle);

    $("<script>").attr({
        src: chrome.extension.getURL("/lib/jquery-ui.min.js"),
        type: "text/javascript"
    }).appendTo("head");

    $("<script>").attr({
        src: chrome.extension.getURL("/lib/lockr.min.js"),
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

    $.get(chrome.extension.getURL("/src/container/container.html"), function(data){
        $("#player").prepend($.parseHTML(data));
    });
	
	$.get(chrome.extension.getURL("/src/container/toggle_button.html"), function(data){
        $("#watch7-sidebar-modules > div:nth-child(1) > div").append($.parseHTML(data));
    });

    containerStyle = $("<link>");
    containerStyle.attr("rel", "stylesheet");
    containerStyle.attr("type", "text/css");
    containerStyle.attr("href", chrome.extension.getURL("/src/container/container.css"));
    $("head").append(containerStyle);

    $("<script>").attr({
        src: chrome.extension.getURL("/src/container/container.js"),
        type: "text/javascript"
    }).appendTo("head");
}

injectContent();
