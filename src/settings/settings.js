//add get and set to all objects
//inside the settings, injecting
//a listener in the set method
function gettersAndSetters(o) {
    for (i in o) {
        if (typeof o[i] == "object") {
            gettersAndSetters(o[i]);
            o.get = function(w) {
                return this[w];
            }
            o.set = function(w, v) {
                if (this[w] !== undefined && v !== undefined && v !== this[w]) {
                    this[w] = v;
                    refreshVisSettings();
                }
            }
        }
    }
}

//get the settings local storage
//storing it in the s variable
function getSettings() {
    //get the current settings
    s = Lockr.get("ytav");

    //set the default settings
    //if s undefined or if running for 
    //the first time
    if (s === undefined) {
        s = setDefaultSettings();
    }
    gettersAndSetters(s);
    return s;
}

//sets the default settings
//always executed in the first time
function setDefaultSettings() {
    s = {
        version: "3.0",
        settings: {
            global: {
                enabled: true
            },
            scenes: {
                bars: {
                    fftSize: 256,
                    smooth: 0.8,
                    barsColor: 0xfc3030,
                    backgroundColor: 0,
                    backgroundOpacity: 0,
                    excludeRatio: 33
                },
                ocilloscope: {
                    fftSize: 256,
                    lineColor: 0xfc3030,
                    lineWidth: 2,
                    backgroundColor: 0,
                    backgroundOpacity: 0
                },
                monsterytav: {
                    smooth: 0.8,
                    barsColor: 0xfc3030,
                    backgroundColor: 0,
                    backgroundOpacity: 0
                }
            }
        }
    };

    gettersAndSetters(s);

    Lockr.set("ytav", s);

    return s;
}
