//all the files SHOULD be added to web_accessible_resources in manifest file
//add all the script files to the html element

//used to get the text javascript code from files and
//add it to the script dom element

function injectScripts() {
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
}

injectScripts();
