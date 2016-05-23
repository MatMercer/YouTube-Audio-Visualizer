//get the settings local storage
function getSettings(name) {
    var setup = {name: name};
    if (typeof name != "string")
        return setup;


    switch (name.toLowerCase()) {
        case "barsscene":
            return setup;
            break;
    }
}
