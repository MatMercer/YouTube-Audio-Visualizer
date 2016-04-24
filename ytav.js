//the visualization var, global
var vis;

function barsScene(barsColor) {
    //the instance
    var inst = this;

    //is the scene animation paused
    inst.paused = true;

    //the bars color
    inst.barsColor = barsColor || 0xfc3030;

    //exclude some "dead bars"
    inst.excludeRatio = 33;

    inst.init = function() {
        //a constant to calculate the bar width responsively
        inst.widthConstant = (100 / (vis.freqDataArray.length - inst.excludeRatio));

        inst.paused = false;
    };

    //renders the scene, using the container, graphics, renderer & dataArray
    inst.render = function(c, g, r, d) {
        if (!inst.paused) {
            //the animation

            //removes the "old bars" from graphics
            g.clear();

            //start drawing with a color & oppacity;
            g.beginFill(inst.barsColor, 1);

            //generate the bars based on i dataArray audio percentage
            for (i = 0; i < d.length - inst.excludeRatio; i++) {
                //the bar width based on the widthConstant
                barWidth = inst.widthConstant * (r.width / 100);

                //draw the rectangle
                g.drawRect(barWidth * i, r.height - (r.height * d[i]), barWidth, r.height * d[i]);
            }

            //finally, add the generated stuff to the container (aka scene)
            c.addChild(g);
        }

        //render the scene
        r.render(c);
    }

}

function audioVisualizer(width, height, containerSelector, sourceSelector, playerSelector, analyserData) {
    //the instance
    var inst = this;

    //the type of scenes, using an index to control it
    //private
    var sceneTypes = [
        "bars"
    ];
    //private
    var sceneIndex = 0;

    //the video dom used to find the size
    inst.$player = $(playerSelector);

    //view size
    inst.width = inst.$player.width();
    inst.height = inst.$player.height();

    //the container
    inst.$container = $(containerSelector);

    //the sound source
    inst.$source = $(sourceSelector);

    //the options for fft analysis
    inst.analyserData = analyserData || {
        fftSize: 256,
        minDecibels: -50,
        maxDecibels: 0,
        smoothingTimeConstant: 0.75
    };

    inst.init = function() {
        //the renderer
        inst.renderer = new PIXI.autoDetectRenderer(inst.width, inst.height, {
            antialias: true,
            transparent: true
        });

        //the scene
        inst.container = new PIXI.Container(0x66ff99);

        //attach the renderer to the DOM element
        inst.$container.prepend(inst.renderer.view);

        //generate the PIXI graphics for draw
        inst.g = new PIXI.Graphics();

        //get audio apis from different browsers
        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        //create the audio context
        inst.audioCtx = new AudioContext();

        //setup the analyser node
        inst.analyser = inst.audioCtx.createAnalyser();
        inst.analyser.fftSize = inst.analyserData.fftSize;
        inst.analyser.minDecibels = inst.analyserData.minDecibels;
        inst.analyser.maxDecibels = inst.analyserData.maxDecibels;
        inst.analyser.smoothingTimeConstant = inst.analyserData.smoothingTimeConstant;

        //create the audio media source
        inst.source = inst.audioCtx.createMediaElementSource(inst.$source[0]);

        //connect the source to analyser & speakers
        inst.source.connect(inst.analyser);
        inst.source.connect(inst.audioCtx.destination);

        //initialize the freq data array with the size of the buffer
        inst.freqDataArray = new Float32Array(inst.analyser.frequencyBinCount);
        inst.analyser.getFloatFrequencyData(inst.freqDataArray);
        inst.cleanUpFreqDataArray();

        //initialize the time domain data array with the size of the buffer
        inst.timeDataArray = new Float32Array(inst.analyser.frequencyBinCount);
        inst.analyser.getFloatTimeDomainData(inst.timeDataArray);

        //the instance of the scenes
        inst.bars = new barsScene();
        inst.bars.init();
    }

    inst.render = function() {
        //get the audio dada & clean it
        inst.analyser.getFloatFrequencyData(inst.freqDataArray);
        inst.cleanUpFreqDataArray();
        
        //get the wave data
        inst.analyser.getFloatTimeDomainData(inst.timeDataArray);

        //renders the current scene
        switch (sceneTypes[sceneIndex]) {
            case "bars":
            default:
                inst.bars.render(inst.container, inst.g, inst.renderer, inst.freqDataArray);
        }

        requestAnimationFrame(inst.render);
    }

    //transform0 data to percentages
    inst.cleanUpFreqDataArray = function() {
        for (i in inst.freqDataArray) {
            if (inst.freqDataArray[i] <= -100 || inst.freqDataArray[i] == -80) {
                inst.freqDataArray[i] = 0;
                continue;
            }
            inst.freqDataArray[i] = (inst.freqDataArray[i] + 100) / 100;
        }
    }

    //go to the next scene
    inst.nextScene = function() {
        sceneIndex += sceneIndex == sceneTypes.length - 1 ? -sceneIndex : 1;
    }
}

$(document).ready(function() {
    vis = new audioVisualizer(640, 360, "#player", "video", "#player-api");
    vis.init();
    vis.render();
});
