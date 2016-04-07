// ==UserScript==
// @name         Audio Visualizer For Youtube
// @namespace    http://tampermonkey.net/
// @version      0.8 BETA
// @description  A simple audio visualizer for Youtube.
// @author       MrAnyone
// @match        https://www.youtube.com/watch?v=*
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/pixi.js/3.0.10/pixi.min.js
// @grant        Thank you very much for the inspiration! https://www.youtube.com/watch?v=okMfwg15lz0
// ==/UserScript==
/* jshint -W097 */
'use strict';

/****************
    SETUP VARS
****************/

//Do debug
var doDebug = true;

//Used to remove some "dead bars"
var excludeRatio = 33;

//Version
var version = "0.8 BETA";

//FFT size, affects how many bars, too higher values are heavy
var FFTSize = 256;

/**********************
    VISUALIZER VARS
**********************/

//Audio handler variables
var audioCtx = null;
var analyser = null;
var dataArray = null;
var source = null;
var $video = null;

//Pixi vars
var container = null;
var renderer = null;
var g = null;

//Visualization variables
var win = $(window);
var barWidth = null;
var sizeControl = null;
var i = null;
var playerAPIDiv = null;
var widthConstant = null;
var smoothInput = null;
var smoothCountText = null;
var fullScreen = false;
var fullScreenBtn = null;
var screenHeight = 0;
var colorPicker = null;
var barsColor = null;


/****************
    FUNCTIONS
****************/

$(document).ready(function() {
    init();
    setElementSource("video");
    setupView();
    requestAnimationFrame(animate);
    domLoopName = domLoop;
    setInterval("domLoopName()", 500);
});

//Init function
function init() {
    try {

        //Get audio apis from different browsers
        if (!(navigator.getUserMedia)) {
            navigator.getUserMedia = (navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia);
        }

        if (!(window.AudioContext)) {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
        }

        //Create the audio context
        if (!(audioCtx)) {
            audioCtx = new AudioContext();
        }

        //Setup the analyser node
        if (!(analyser)) {
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = FFTSize;
            analyser.minDecibels = -80;
            analyser.maxDecibels = 0;
            analyser.smoothingTimeConstant = 0.8;
        }

        //Generate the dataArray
        if (!(dataArray)) {
            dataArray = new Uint8Array(analyser.fftSize / 2);
        }

        //Simple function to map values from one range to another
        Number.prototype.map = function(in_min, in_max, out_min, out_max) {
            return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
        };

        debug("Init successfull!", "INFO");
    } catch (e) {
        alert("Error! Probably your browser doesn't support the Web Audio API!");
        debug(e, "ERROR");
    }
}

//Try to find the video DOM with given ID and create an audio source
function setElementSource(id) {
    //Try to find the video
    $video = $(id);

    if ($video) {
        //Create audio element
        source = audioCtx.createMediaElementSource($video[0]);

        //Route source to analyser & speakers
        source.connect(analyser);
        source.connect(audioCtx.destination);

        debug("setElementSource successfull!", "INFO");
    } else {
        debug("The video element was not found!", "WARNING");
    }
}

//Setup the visualizer
function setupView() {
    try {
        //A div to get the video size
        playerAPIDiv = $("#player-api");

        //Generate "PIXI stuff"
        if (!(container || renderer || g)) {
            //The container
            container = new PIXI.Container(0x66FF99);

            //The renderer
            renderer = PIXI.autoDetectRenderer(playerAPIDiv.width(), playerAPIDiv.height());

            //Setup the ytav div
            $("#player").prepend($("<div>", {
                id: "ytav"
            }));

            //Add the view (canvas) of the renderer
            $("#ytav").prepend(renderer.view);

            //Setup ytav-controls
            $("#ytav").append($("<div>", {
                id: "ytav-controls"
            }).css({
                float: "right",
                width: ($("#ytav").width() - renderer.width) * 0.9 + "px",
                margin: "0px"
            }));

            $("#ytav-controls").append($("<div>", {
                id: "ytav-title"
            }).css({
                width: "70%",
                margin: "0 0 5% 0"
            }));

            $("#ytav-title").append($("<h1>").text("Youtube Audio Visualizer").css("color", "black"));

            $("#ytav-title").append($("<p>").text("v. " + version + " By MrAnyone").css({
                color: "red",
                float: "right",
                fontSize: "0.8em"
            }));

            $("#ytav-controls").append($("<div>", {
                id: "ytav-controls-input"
            }));

            smoothPelmt = $("<p>").css({
                color: "black"
            }).text("Smoothness: ");

            smoothCountText = $("<b>", {
                id: "smooth-count"
            }).text("80");

            smoothPelmt.append(smoothCountText);

            $("#ytav-controls-input").append(smoothPelmt);

            smoothInput = $("<input>", {
                type: "range",
                id: "ytav-input-smooth",
                min: "0",
                max: "99",
                value: "80"
            }).css({
                display: "block"
            });
            smoothPelmt.append(smoothInput);

            colorPelmt = $("<p>").css({
                color: "black"
            }).text("BarColor: ");

            colorPicker = $("<input>", {
                id: "ytav-input-color",
                type: "color",
                value: "#FC3030"
            });

            colorPelmt.append(colorPicker);

            $("#ytav-controls-input").append(colorPelmt);

            fullScreenBtn = $("<input>", {
                id: "ytav-full-button",
                type: "button",
                value: "FullScreen",
                onload: "this.full = false",
                onclick: "this.full = this.full ? false:true;"
            });

            $("#ytav-controls-input").append(fullScreenBtn);

            //Generate PIXI graphics for bar draw
            g = new PIXI.Graphics();
        }

        //A constant to calcule the bar width responsively
        widthConstant = (100 / (dataArray.length - excludeRatio));

        debug("Setup view successfull!", "INFO");
    } catch (e) {
        debug("Failed to setup the view!\n" + e, "ERROR");
    }
}

//The animate loop
function animate() {
    //Animate loop
    requestAnimationFrame(animate);

    //Get the audio data
    passByteFrequencyData(dataArray);

    //Removes the "older bars" from graphics
    g.clear();

    //Starts drawing with a color & oppacity
    g.beginFill(barsColor, 1);

    //Generate the bars based on i dataArray audio size
    for (i = 0; i < dataArray.length - excludeRatio; i++) {
        //The barWidth based on a percent of the view based on the dataArray
        barWidth = widthConstant * (renderer.width / 100);

        sizeControl = dataArray[i].map(0, 255, 0, renderer.height);
        g.drawRect(barWidth * i, renderer.height - sizeControl, barWidth, sizeControl);
    }

    //Finally, add the generated stuff to container
    container.addChild(g);

    //Render the Container
    renderer.render(container);
}

//DOM element loop
function domLoop() {
    //Get the fullscreen var
    fullScreen = fullScreenBtn[0].full;

    //Update height var
    screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    //Resize the view when necessary
    if (playerAPIDiv.width() != renderer.width && !fullScreen || playerAPIDiv.height() != renderer.height && !fullScreen) {
        renderer.resize(playerAPIDiv.width(), playerAPIDiv.height());
        $("#ytav-controls").css("width", ($("#ytav").width() - renderer.width) * 0.9);

        $("canvas").css({
            position: "static",
            top: 0,
            left: 0,
            width: playerAPIDiv.width(),
            height: playerAPIDiv.height(),
            zIndex: "initial"
        });

        fullScreenBtn.css({
            position: "static",
            zIndex: "initial"
        });

        debug("Resized canvas in normal mode!", "INFO");
    } else if (fullScreen && $("canvas").height() != screenHeight) {
        $("canvas").css({
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: screenHeight + "px",
            zIndex: 777
        });
        renderer.resize(win.width(), screenHeight);

        fullScreenBtn.css({
            position: "fixed",
            bottom: 0,
            right: 0,
            zIndex: 778
        });
        debug("Resized canvas in FullScreen mode!", "INFO");
    }

    //Update the smoothness when necessary
    if (smoothInput.val() / 100 != analyser.smoothingTimeConstant) {
        analyser.smoothingTimeConstant = smoothInput.val() / 100;
        smoothCountText.text(smoothInput.val());
    }

    //Get the input color
    getInputColor(colorPicker[0].value);
}

/************
    UTILS
************/

//A debug function
function debug(msg, type) {
    if (doDebug) {
        switch (type) {
            case "ERROR":
                console.log("[ERROR] YTMV > " + msg);
                break;
            case "INFO":
                console.log("[INFO] YTMV > " + msg);
                break;
            case "WARNING":
                console.log("[WARNING] YTMV > " + msg);
                break;
            default:
                console.log("[DEBUG] YTMV > " + msg);
                break;
        }
    }
}

//Get the data from the running analyser
function passByteFrequencyData(array) {
    try {
        analyser.getByteFrequencyData(array);
    } catch (e) {
        debug("Error passing the ByteFrequencyData!", "ERROR");
    }
}

//Get the input color removing the "#"
function getInputColor(hex) {
    barsColor = parseInt(hex.substring(1), 16);
}