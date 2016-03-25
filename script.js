// ==UserScript==
// @name         Adio Visualizer For Youtube
// @namespace    http://tampermonkey.net/
// @version      0.3 BETA
// @description  A simple audio visualizer for Youtube.
// @author       MrAnyone
// @match        https://www.youtube.com/watch?v=*
// @include      https://www.youtube.com/embed/*
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

//Used to remove some "dead bards"
var excludeRatio = 33;

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
var barWidth = null;
var sizeControl = null;
var i = null;


/****************
    FUNCTIONS
****************/

$(document).ready(function() {
    init();
    setElementSource("video");
    setupView();
    requestAnimationFrame(animate);
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
            analyser.fftSize = 256;
            analyser.minDecibels = -80;
            analyser.maxDecibels = 0;
            analyser.smoothingTimeConstant = 0.8;
        }

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

function setElementSource(id) {
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

function setupView() {
    try {
        if (!(container || renderer || g)) {
            container = new PIXI.Container(0x66FF99);
            renderer = PIXI.autoDetectRenderer($("#player-api").width(), $("#player-api").height());
            $("#player-mole-container").prepend(renderer.view);
            g = new PIXI.Graphics();
        }

        barWidth = (100 / (dataArray.length - excludeRatio)) * (renderer.width / 100);

        debug("Setup view successfull!", "INFO");
    } catch (e) {
        debug("Failed to setup the view!\n" + e, "ERROR");
    }
}

function animate() {
    requestAnimationFrame(animate);
    passByteFrequencyData(dataArray);
    g.clear();
    g.beginFill(0x5CE6FF, 1);

    for (i = 0; i < dataArray.length - excludeRatio; i++) {
        sizeControl = dataArray[i].map(0, 255, 0, renderer.height);
        g.drawRect(barWidth * i, renderer.height - sizeControl, barWidth, sizeControl);
    }

    container.addChild(g);

    //Render the Container
    renderer.render(container);
}

/************
    UTILS
************/
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

function passByteFrequencyData(array) {
    try {
        analyser.getByteFrequencyData(array);
    } catch (e) {
        debug("Error passing the ByteFrequencyData!", "ERROR");
    }
}