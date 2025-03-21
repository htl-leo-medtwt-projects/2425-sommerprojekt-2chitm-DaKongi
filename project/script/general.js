let settingsVisible = false;
let settings = document.getElementById("settings");

const user_preference_appearance_json_default = {
    "primary-color": "#ADFCF9",
    "secondary-color": "#118A8A",
    "accent-color": "#F7A278",
    "background-color": "#F7F7F7",
    "font-color": "#02182B",
    "font-family": "jura"
}

let user_preference_appearance_json = {
    "primary-color": "#ADFCF9",
    "secondary-color": "#118A8A",
    "accent-color": "#F7A278",
    "background-color": "#F7F7F7",
    "font-color": "#02182B",
    "font-family": "jura"
}

function toggleSettings() {

    if (!settingsVisible) {
        settings.style.display = "block";
        settingsVisible = true;
    } else {
        settings.style.display = "none";
        settingsVisible = false;
    }
}

//+++++++++++++++++++++++++++++
//Code for customizable colors
//+++++++++++++++++++++++++++++

//save the settings
function saveSettings() {
    user_preference_appearance_json["font-color"] = document.getElementById("inputFontColor").value;
    user_preference_appearance_json["primary-color"] = document.getElementById("inputPrimaryColor").value;
    user_preference_appearance_json["secondary-color"] = document.getElementById("inputSecondaryColor").value;
    user_preference_appearance_json["accent-color"] = document.getElementById("inputAccentColor").value;
    user_preference_appearance_json["background-color"] = document.getElementById("inputBgColor").value;

    console.log("Settings saved");

    localStorage.setItem("user_prefernce_appearance", JSON.stringify(user_preference_appearance_json));

    updateUI();

    updateReadability();
}

//load settings from local storage
function getAppearance() {
    user_preference_appearance_json = JSON.parse(localStorage.getItem("user_prefernce_appearance"));
}

//set the new css propertys
function updateApperance() {
    //update the css
    for (let key in user_preference_appearance_json) {
        document.documentElement.style.setProperty(`--${key}`, user_preference_appearance_json[key]);
    }

    //update the input field values
    document.getElementById("inputFontColor").value = user_preference_appearance_json["font-color"];
    document.getElementById("inputPrimaryColor").value = user_preference_appearance_json["primary-color"];
    document.getElementById("inputSecondaryColor").value = user_preference_appearance_json["secondary-color"];
    document.getElementById("inputAccentColor").value = user_preference_appearance_json["accent-color"];
    document.getElementById("inputBgColor").value = user_preference_appearance_json["background-color"];
}

function updateUI() {
    getAppearance();
    updateApperance();
}

function updateReadability() {
    document.getElementById("readability").innerHTML = getContrastQuality(document.getElementById("inputFontColor").value, document.getElementById("inputBgColor").value);
}

function resetAppearanceToDefault() {
    user_preference_appearance_json = user_preference_appearance_json_default;

    localStorage.setItem("user_prefernce_appearance", JSON.stringify(user_preference_appearance_json));

    updateUI();
    updateReadability();
}

//load settings when reloading the site
function getAppearanceOnSideload() {
    if (localStorage.getItem("user_prefernce_appearance") == null) return; //if no settings made - skip

    updateUI();
}
getAppearanceOnSideload(); //load settings on startup

//checking for good contrast !!Written by BlackboxAI!!
function hexToLuminance(hex) {
    // Hex to RGB
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    // apply luminance transformation
    function transform(c) {
        return (c <= 0.03928) ? (c / 12.92) : Math.pow((c + 0.055) / 1.055, 2.4);
    }

    let luminance = 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
    return luminance;
}

function getContrastRatio(hex1, hex2) {
    let lum1 = hexToLuminance(hex1);
    let lum2 = hexToLuminance(hex2);

    let brighter = Math.max(lum1, lum2);
    let darker = Math.min(lum1, lum2);

    return (brighter + 0.05) / (darker + 0.05);
}

function getContrastQuality(hex1, hex2) {
    let contrast = getContrastRatio(hex1, hex2);
    if (contrast >= 20) {
        return "Excellent"; // perfect contrast
    } else if (contrast >= 7.0) {
        return "good"; // high contrast
    } else if (contrast >= 4.5) {
        return "medium"; // medium constrast
    } else {
        return "bad"; // low contrast
    }
}