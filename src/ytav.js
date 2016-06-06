//the visualization var, global
var vis;

//the settings, used by everything
//in real time
var st = getSettings();

function barsScene() {
    //the instance
    var inst = this;

    //the scene name
    inst.name = "Bars";

    //renders the scene, using the container, graphics, renderer & freqDataArray
    inst.render = function(c, g, r, d) {
        //the animation

        //a constant to calculate the bar width responsively
        inst.widthConstant = (100 / (vis.freqDataArray.length - st.settings.scenes.bars.excludeRatio));

        //clears the graphics
        g.clear();

        if (st.settings.scenes.bars.backgroundOpacity) {
            drawBackground(g, r, st.settings.scenes.bars.backgroundColor, st.settings.scenes.bars.backgroundOpacity);
        }

        //draw the bars
        g.beginFill(st.settings.scenes.bars.barsColor, 1);

        //generate the bars based on i dataArray audio percentage
        for (i = 0; i < d.length - st.settings.scenes.bars.excludeRatio; i++) {
            //the bar width based on the widthConstant
            barWidth = inst.widthConstant * (r.width / 100);

            //draw the rectangle
            g.drawRect(barWidth * i, r.height - (r.height * d[i]), barWidth, r.height * d[i]);
        }

        //finally, add the generated stuff to the container (aka scene)
        c.addChild(g);

        //render the scene
        r.render(c);
    };

}

function ocilloscopeScene(lineColor, lineWidth, backgroundColor, backgroundOpacity) {
    //the instance
    var inst = this;

    //the scene name
    inst.name = "Oscilloscope";

    //renders the scene, using container, graphics, renderer & timeData
    inst.render = function(c, g, r, d) {
        //the animation

        //a constant to calculate the line width responsively
        inst.widthConstant = (100 / vis.freqDataArray.length);

        //clears the graphics
        g.clear();

        if (st.settings.scenes.ocilloscope.backgroundOpacity) {
            drawBackground(g, r, st.settings.scenes.ocilloscope.backgroundColor, st.settings.scenes.ocilloscope.backgroundOpacity);
        }

        //move the drawer to start point
        g.moveTo(0, (r.height / 2) + (r.height * d[0] / 1.5));

        //the line style
        g.lineStyle(st.settings.scenes.ocilloscope.lineWidth, st.settings.scenes.ocilloscope.lineColor);

        //start drawing with a color & oppacity
        g.beginFill(inst.lineColor, 0);

        for (i = 1; i < d.length; i++) {
            //the line width based on the widthConstant
            lineWidth = inst.widthConstant * (r.width / 100);

            //draw the line, in the next loop, the drawer will be at the given coord
            g.lineTo(lineWidth * i, (r.height / 2) + (r.height * d[i] / 1.5));
        }

        //finally, add the generated stuff to the container (aka scene)
        c.addChild(g);

        //render the scene
        r.render(c);
    };
}

function monsterYTAVScene(barsColor) {
    //the instance
    var inst = this;

    //the scene name
    inst.name = "MonsterYTAV";

    //the bars area
    inst.barArea = new PIXI.Point(0, 0);

    //the bars position
    inst.barPos = new PIXI.Point(0, 0);

    //the bars between distance in px
    inst.barDist = 1;

    //the bars color
    inst.barsColor = barsColor || 0xfc3030;

    //background color
    inst.backgroundColor = 0;

    //background opacity
    inst.backgroundOpacity = 0;

    //the frequency index used to set the
    //custom freqData
    inst.low = new PIXI.Point(5, 40);
    inst.mid = new PIXI.Point(50, 85);
    inst.high = new PIXI.Point(2030, 2050);

    //custom freqdata
    inst.freqData = [];

    //renders the scene using container, graphics, renderer, freqDataArray
    inst.render = function(c, g, r, d) {
        //set the custom freqData
        //if the scene isn't paused
        if (!vis.paused) {
            inst.freqData = inst.getCustomFrequencyData(d);
        }

        //set the bars area 80% of the view width and 40%
        //from the view heigth
        inst.barArea.set(r.width * 0.9, r.height * 0.4);

        //used to make the bars centered
        //a 20% up
        inst.barPos.set((r.width - inst.barArea.x) / 2, ((r.height - inst.barArea.y) / 2) - r.height * 0.2);

        //clears the graphics
        g.clear();

        if (st.settings.scenes.monsterytav.backgroundOpacity) {
            drawBackground(g, r, st.settings.scenes.monsterytav.backgroundColor, st.settings.scenes.monsterytav.backgroundOpacity);
        }

        //draw the bars
        g.beginFill(st.settings.scenes.monsterytav.barsColor, 1);

        //a width constant
        inst.widthConstant = (100 / inst.freqData.length);

        //the bar width, discouting the barDist
        barWidth = inst.widthConstant * ((inst.barArea.x - (st.settings.scenes.monsterytav.barsDist * inst.freqData.length)) / 100);

        for (i in inst.freqData) {
            g.drawRect(inst.barPos.x + (barWidth * i) + (st.settings.scenes.monsterytav.barsDist * i), ((r.height / 2) + (r.height * 0.2)) - (inst.barArea.y * inst.freqData[i]), barWidth, (inst.barArea.y * inst.freqData[i]) + (inst.barArea.y / 100));
        }

        //add the graphics to container
        c.addChild(g);

        //render it
        r.render(c);
    };

    //used to get a custom frequency data
    inst.getCustomFrequencyData = function(d) {
        //the local instance of a new array object
        freq = []

        //the low frequency data
        for (i = inst.low.x; i < inst.low.y; i++) {
            freq.push(d[i]);
        }

        //the medium frequency data
        for (i = inst.mid.x; i < inst.mid.y; i++) {
            freq.push(d[i]);
        }

        //the high frequency data
        for (i = inst.high.x; i < inst.high.y; i++) {
            //increses the data a little
            freq.push(d[i] * 1.2);
        }

        //adjusts some values, incresing the difference
        for (i = 0; i < freq.length; i++) {
            freq[i] *= (freq[i] / 0.12) * (freq[i]);
            freq[i] *= 0.12;
        }

        //used to remove "dead falls" on the bars
        //make the frequency data more dynamic
        for (i = 1, j = freq.length - 1; i < freq.length; i++, j--) {
            freq[i] += 0.57 * freq[i - 1];
            freq[j] += 0.57 * freq[j - 1];
        }

        //returns the custom frequency
        return freq;
    };
}

function audioVisualizer(width, height, containerSelector, sourceSelector, playerSelector, analyserData) {
    //the instance
    var inst = this;

    //the type of scenes, using an index to control it
    //private
    var sceneTypes = [
        "bars",
        "ocilloscope",
        "monsterytav"
    ];

    //keeps counting the frames since the start
    var frameCount = 0;

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
        smoothingTimeConstant: 0.8
    };

    //the scenes instances
    var scenes = [];

    //is paused or not
    inst.paused = false;

    inst.init = function() {
        //the renderer
        inst.renderer = new PIXI.autoDetectRenderer(inst.width, inst.height, {
            transparent: true
        });

        //the scene
        inst.container = new PIXI.Container(0x66ff99);

        //the view
        inst.$view = $(inst.renderer.view);

        //pauses the animation when the canvas is clicked
        //but you can see color changes since the scenes
        //are rendered the same way
        inst.$view.click(function() {
            vis.pp();
        });

        //attach the renderer to the DOM element
        inst.$container.prepend(inst.$view);

        //generate the PIXI graphics for draw
        inst.g = new PIXI.Graphics();

        //get audio apis from different browsers
        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        //create the audio context
        inst.audioCtx = new AudioContext();

        //add the analyser node
        inst.analyser = inst.audioCtx.createAnalyser();

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
        bars = new barsScene();

        ocillo = new ocilloscopeScene();

        monster = new monsterYTAVScene();

        scenes.push(bars);
        scenes.push(ocillo);
        scenes.push(monster);

        //update the analyser config
        inst.updateAnalyserConfig();
    };

    inst.render = function() {
        //updates the frameCount
        frameCount += 1;

        if (!inst.paused) {
            //get the audio dada & clean it
            inst.analyser.getFloatFrequencyData(inst.freqDataArray);
            inst.cleanUpFreqDataArray();

            //get the wave data
            inst.analyser.getFloatTimeDomainData(inst.timeDataArray);
        }

        //renders the current scene
        switch (sceneTypes[st.settings.global.sceneIndex]) {
            case "monsterytav":
                scenes[st.settings.global.sceneIndex].render(inst.container, inst.g, inst.renderer, inst.freqDataArray);
                break;
            case "ocilloscope":
                scenes[st.settings.global.sceneIndex].render(inst.container, inst.g, inst.renderer, inst.timeDataArray);
                break;
            case "bars":
            default:
                scenes[st.settings.global.sceneIndex].render(inst.container, inst.g, inst.renderer, inst.freqDataArray);
                break;
        }

        requestAnimationFrame(inst.render);
    };

    //transform freqData to percentages
    inst.cleanUpFreqDataArray = function() {
        for (i in inst.freqDataArray) {
            if (inst.freqDataArray[i] <= -100 || inst.freqDataArray[i] == -80 || inst.freqDataArray[i] == -50) {
                inst.freqDataArray[i] = 0;
                continue;
            }
            inst.freqDataArray[i] = (inst.freqDataArray[i] + 100) / 100;
        }
    };

    //go to the next scene
    inst.nextScene = function() {
        idx = st.settings.global.sceneIndex;
        idx += idx == sceneTypes.length - 1 ? -idx : 1;
        st.settings.global.set("sceneIndex", idx);
        inst.updateAnalyserConfig();
    };

    //go to the previous scene
    inst.previousScene = function() {
        idx = st.settings.global.sceneIndex;
        idx -= idx == 0 ? -(sceneTypes.length - 1) : 1;
        console.log(idx);
        st.settings.global.set("sceneIndex", idx);
        inst.updateAnalyserConfig();
    };

    //Pause/Play the scene
    inst.pp = function() {
        inst.paused = inst.paused ? false : true;
    };

    //set the fftSize
    inst.setFFT = function(size) {
        inst.analyser.fftSize = size;
        inst.freqDataArray = new Float32Array(inst.analyser.frequencyBinCount);
        inst.timeDataArray = new Float32Array(inst.analyser.frequencyBinCount);
    };


    //update the analyser config
    inst.updateAnalyserConfig = function(config) {
        inst.analyser.smoothingTimeConstant = st.settings.scenes.get(sceneTypes[st.settings.global.sceneIndex]).smooth || 0.8;
        inst.setFFT(st.settings.scenes.get(sceneTypes[st.settings.global.sceneIndex]).fftSize || 256);
    };

    inst.getSceneByName = function(name) {
        for (i in scenes) {
            if (scenes[i].name.toLowerCase() == name.toLowerCase()) {
                return scenes[i];
            }
        }
        return undefined;
    }

}

//used to focus on the YT video
function scrollToVideo() {
    $("html, body").animate({
        scrollTop: $("#content").offset().top - $("#player > canvas").offset().top
    }, 500);
}

//used to know if the settings has been changed
function refreshVisSettings(w) {
    switch (w) {
        case "smooth":
        case "fftSize":
            vis.updateAnalyserConfig();
        default:
            break;
    }
    saveSettings(st);
}

//draws a background with
//given pixi graphics & render, 
//color & opacity
function drawBackground(g, r, c, o) {
    //draw the background
    g.beginFill(c, o);
    g.drawRect(-10, -10, r.width + 10, r.height + 10);

    //ends the fill for background
    g.endFill();
}
