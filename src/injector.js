//injects javascripts files in the page using script tags
function injectJsFiles(paths) {
    for (i = 0; i < paths.length; i++) {
        path = chrome.extension.getURL(paths[i]);

        $("<script>").attr({
            src: path,
            type: "text/javascript"
        }).appendTo("head");
    }
}

//injects css files in the page using link tags
function injectCSSFiles(paths) {
    for (i = 0; i < paths.length; i++) {
        path = chrome.extension.getURL(paths[i]);

        $("<link>").attr({
            rel: "stylesheet",
            type: "text/css",
            href: path
        }).appendTo("head");
    }
}

//injects an html file in the page parsing the html data
function injectHtmlFile(path, where) {
    $.get(chrome.extension.getURL(path), function(data) {
        $(where).prepend($.parseHTML(data));
    });
}

//all the files SHOULD be added to web_accessible_resources in manifest file
//add all the script files to the html element

//inject all the extension content used to work
function injectContent() {
    scripts = [
        "/lib/pixi.min.js",
        "/lib/jquery.min.js",
        "/lib/jquery-ui.min.js",
        "/lib/lockr.min.js",
        "/src/settings/settings.js",
        "/src/ytav.js",
        "/src/listeners/ytav_listeners.js",
        "/src/container/container.js"
    ];

    stylesheets = [
        "/lib/jquery-ui.css",
        "./src/container/container.css"
    ];

    injectHtmlFile("/src/container/container.html", "#page-container");
    injectJsFiles(scripts);
    injectCSSFiles(stylesheets);
}

injectContent();
