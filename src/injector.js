//all the files SHOULD be added to web_accessible_resources in manifest file
//add all the script files to the html element

//used to get the text javascript code from files and
//add it to the script dom element

function injectScripts() {
    var text = null;
    var script = document.createElement("script");
    $.get(chrome.extension.getURL("/lib/pixi/bin/pixi.min.js"),
        function(data) {
            text = "" + data;
            script.appendChild(document.createTextNode(text));
            $.get(chrome.extension.getURL("/lib/jquery/dist/jquery.min.js"),
                function(data) {
                    text = "" + data;
                    script.appendChild(document.createTextNode(text));
                    $.get(chrome.extension.getURL("/lib/cookie/src/js.cookie.js"),
                        function(data) {
                            text = "" + data;
                            script.appendChild(document.createTextNode(text));
                            $.get(chrome.extension.getURL("/src/ytav.js"),
                                function(data) {
                                    text = "" + data;
                                    script.appendChild(document.createTextNode(text));
                                    $.get(chrome.extension.getURL("/src/listeners/ytav_listeners.js"),
                                        function(data) {
                                            text = "" + data;
                                            script.appendChild(document.createTextNode(text));
                                            document.head.appendChild(script);
                                        });
                                });
                        });
                });
        });
}
injectScripts();
