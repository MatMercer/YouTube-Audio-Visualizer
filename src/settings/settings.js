//get the settings local storage
//storing it in the s variable
function getSettings(s) {
    if(Lockr.get("ytav") == undefined) {
        setDefaultSettings();
    }
    
    s = Lockr.get("ytav");

    return s;
}

//sets the default settings
//always executed in the first time
function setDefaultSettings() {
    var s = {
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

    Lockr.set("ytav", s);
}
