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

function resetAppearanceToDefault() {
    user_preference_appearance_json = user_preference_appearance_json_default;

    localStorage.setItem("user_prefernce_appearance", JSON.stringify(user_preference_appearance_json));

    updateUI();
}

//load settings when reloading the site
function getAppearanceOnSideload() {
    if (localStorage.getItem("user_prefernce_appearance") == null) return; //if no settings made - skip

    updateUI();
}
getAppearanceOnSideload(); //load settings on startup